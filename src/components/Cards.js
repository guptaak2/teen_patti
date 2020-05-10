import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import fire from 'firebase'
import '../App.css';

const divStyle = {
    display: 'flex',
    justifyContent: 'center'
};

const table = {
    display: 'grid'
}

const horizontal = {
    display: 'flex',
    justifyContent: 'center'
}

class Cards extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
        this.handleNumPlayersFieldChange = this.handleNumPlayersFieldChange.bind(this);
        this.handleNumCardsFieldChange = this.handleNumCardsFieldChange.bind(this);
        this.generate = this.generate.bind(this);
        this.getCards = this.getCards.bind(this);
        this.getRealCards = this.getRealCards.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.packed = this.packed.bind(this);
        this.showCards = this.showCards.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.getCellColor = this.getCellColor.bind(this);

        this.state = {
            cardIndicies: this.getCardIndicies(),
            firstCard: [],
            secondCard: [],
            thirdCard: [],
            fourthCard: [],
            playerStats: [],
            numPlayers: 0,
            numPackedPlayers: 0,
            numCards: 3,
            userState: this.props.userState,
            displayName: '',
            gameSet: true,
            enableSee: this.getEnableSee(),
            enablePack: this.getEnablePack(),
            enableShow: this.getEnableShow(),
            firstImgUrl: this.getFirstCardURL(),
            secondImgUrl: this.getSecondCardURL(),
            thirdImgUrl: this.getThirdCardURL(),
            fourthImgUrl: this.getFourthCardURL()
        }
    }

    scrollToBottom() {
        const { cardsStats } = this.refs;
        cardsStats.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    displayName: user.displayName,
                    userState: user
                })
            }
        })

        fire.database().ref('users').on('value', snap => {
            var snapVal = snap.val()
            this.setState({
                gameSet: snapVal.isGameSet,
                numCards: parseInt(snapVal.numCardsPerPlayer),
                numPlayers: parseInt(snapVal.numPlayers),
                numPackedPlayers: parseInt(snapVal.numPackedPlayers)
            }, () => {
                this.updateTable()
            })
        })

        fire.database().ref('users/list').on('child_changed', snap => {
            this.updateTable()
        })

        this.updateTable()
    }

    updateTable() {
        this.setState({ playerStats: [] })
        if (this.state.gameSet && (parseInt(this.state.numPlayers) - parseInt(this.state.numPackedPlayers) == 2)) {
            if (this.getEnablePack()) {
                this.storeEnableShow(true)
            }
        } else if (!this.state.gameSet) {
            localStorage.clear()
        }

        fire.database().ref('users').child('list').once('value').then((snap) => {
            snap.forEach((user) => {
                if (user.val().isLoggedIn) {
                    var name = user.val().name
                    var status = user.val().status
                    if (user.val().cards != null) {
                        var urls = user.val().cards.urls
                    }
                    if (status == 'SHOW' && urls != null) {
                        this.setState({
                            playerStats: this.state.playerStats.concat({ name, status, urls })
                        })
                    } else {
                        this.setState({
                            playerStats: this.state.playerStats.concat({ name, status })
                        })
                    }
                }
            })
        })
    }

    logout() {
        localStorage.clear()
        fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({
            cards: null,
            isLoggedIn: false,
            status: 'BLIND'
        }).then((u) => {
            fire.auth().signOut().then((result) => {
                this.setState({
                    userState: null
                })
            })
        })
    }

    resetGame(e) {
        e.preventDefault()
        localStorage.clear()
        // update isGameSet to database after reset game
        var updates = {};
        var ref = fire.database().ref('users/')
        updates['isGameSet'] = false;
        updates['numPackedPlayers'] = 0;

        this.setState({
            gameSet: false,
            firstCard: [],
            secondCard: [],
            thirdCard: [],
            fourthCard: [],
            playerStats: [],
            cardIndicies: [],
            numPackedPlayers: 0,
            firstImgUrl: '',
            secondImgUrl: '',
            thirdImgUrl: '',
            fourthImgUrl: ''
        })

        this.storeEnableSee(true)
        this.storeEnablePack(false)
        this.storeEnableShow(false)

        ref.update(updates).then((u) => {
            fire.database().ref('users').child('list').once('value').then((snap) => {
                snap.forEach((user) => {
                    if (user.val().isLoggedIn) {
                        fire.database().ref('users/list/' + user.key).update({
                            cards: null,
                            status: 'BLIND'
                        })
                    }
                })
            })
        })
    }

    generate(e) {
        e.preventDefault()
        // update isGameSet, numCards and numPlayers to database
        var updates = {};
        var ref = fire.database().ref('users/')
        updates['isGameSet'] = true;
        updates['numCardsPerPlayer'] = this.state.numCards
        updates['numPlayers'] = this.state.numPlayers
        ref.update(updates).then((u) => {
            this.setState({
                gameSet: true
            })
        })

        let randomNumbers = new Set();
        let cardsTrips = [];
        for (let i = 0; i < 52; i++) {
            var rand = Math.floor((Math.random() * (51)));
            randomNumbers.add(rand);
        }

        var cardsSet = randomNumbers.values()
        const cardsNum = this.state.numCards

        for (let j = 0; j < this.state.numPlayers; j++) {
            if (cardsNum == 1) {
                cardsTrips[j] = [cardsSet.next().value];
            } else if (cardsNum == 2) {
                cardsTrips[j] = [cardsSet.next().value, cardsSet.next().value];
            } else if (cardsNum == 3) {
                cardsTrips[j] = [cardsSet.next().value, cardsSet.next().value, cardsSet.next().value];
            } else if (cardsNum == 4) {
                cardsTrips[j] = [cardsSet.next().value, cardsSet.next().value, cardsSet.next().value, cardsSet.next().value];
            } else {
                cardsTrips[j] = [cardsSet.next().value, cardsSet.next().value, cardsSet.next().value];
            }
        }

        // update cards to database
        var i = 0;
        fire.database().ref('users').child('list').once('value').then((snap) => {
            snap.forEach((user) => {
                if (user.val().isLoggedIn && i < this.state.numPlayers) {
                    fire.database().ref('users/list/' + user.key).update({ cards: cardsTrips[i] })
                    i++;
                }
            })
        })
    }

    getCards(e) {
        e.preventDefault()
        if (this.state.gameSet == true) {
            fire.database().ref('users/list/' + fire.auth().currentUser.uid + '/cards').once('value').then((snap => {
                this.storeCardIndicies(snap.val())
                this.getRealCards()
            })).then((u) => {
                this.storeEnableSee(false)
                this.storeEnablePack(true)
                this.storeEnableShow(false)
                fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({ status: 'SEEN' })
            })
        } else {
            window.confirm("You need to setup a game before seeing your cards")
        }
    }

    getRealCards() {
        const cardsNum = this.state.numCards
        if (cardsNum == 1) {
            this.getFirstRealCard()
        } else if (cardsNum == 2) {
            this.getSecondRealCard()
        } else if (cardsNum == 3) {
            this.getThirdRealCard()
        } else if (cardsNum == 4) {
            this.getFourthRealCard()
        } else {
            this.getThirdRealCard()
        }
    }

    packed(e) {
        e.preventDefault()
        this.storePacked()
        var updates = {};
        var ref = fire.database().ref('users/')
        updates['numPackedPlayers'] = parseInt(this.state.numPackedPlayers) + 1;
        ref.update(updates).then((u) => {
            this.setState({
                numPackedPlayers: parseInt(this.state.numPackedPlayers) + 1
            })
        }).then((u) => {
            fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({ status: 'PACK' })
        })
    }

    showCards(e) {
        e.preventDefault()

        this.storeEnableSee(false)
        this.storeEnablePack(false)
        this.storeEnableShow(false)
        fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({ status: 'SHOW' })
    }

    renderStats() {
        const stats = this.state.playerStats
        const trimmedStats = stats.slice(Math.max(stats.length - parseInt(this.state.numPlayers), 0))
        return (
            <div style={table}>
                <table align="center" border="1" width="500px">
                    <thead>
                        <tr>
                            <th><h2>Name</h2></th>
                            <th><h2>Status</h2></th>
                            <th><h2>Cards</h2></th>
                        </tr>
                    </thead>
                    <tbody>
                        {trimmedStats.map((row, index) => {
                            return (
                                <tr key={index}>
                                    <td><h3>{row.name}</h3></td>
                                    <td style={{ 'background-color': this.getCellColor(row) }}><h3><font color="#FFF">{row.status}</font></h3></td>
                                    <td><h3>{this.getRealCardsMessage(row.urls)}</h3></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>)
    }

    renderCardsPictures() {
        return (
            <div style={horizontal}>
                {this.renderRealCards()}
            </div>
        )
    }

    renderRealCards() {
        const cardsNum = this.state.numCards
        if (this.state.gameSet && this.getCardIndicies().length > 0) {
            if (cardsNum == 1) {
                return (
                    <div style={horizontal}>
                        <img width="100" height="125" alt="first-card" src={this.state.firstImgUrl || ''}></img>
                    </div>
                )
            } else if (cardsNum == 2) {
                return (
                    <div style={horizontal}>
                        <img width="100" height="125" alt="first-card" src={this.state.firstImgUrl || ''}></img>
                        <img width="100" height="125" alt="second-card" src={this.state.secondImgUrl || ''}></img>
                    </div>
                )
            } else if (cardsNum == 3) {
                return (
                    <div style={horizontal}>
                        <img width="100" height="125" alt="first-card" src={this.state.firstImgUrl || ''}></img>
                        <img width="100" height="125" alt="second-card" src={this.state.secondImgUrl || ''}></img>
                        <img width="100" height="125" alt="third-card" src={this.state.thirdImgUrl || ''}></img>
                    </div>
                )
            } else if (cardsNum == 4) {
                return (
                    <div style={horizontal}>
                        <img width="100" height="125" alt="first-card" src={this.state.firstImgUrl || ''}></img>
                        <img width="100" height="125" alt="second-card" src={this.state.secondImgUrl || ''}></img>
                        <img width="100" height="125" alt="third-card" src={this.state.thirdImgUrl || ''}></img>
                        <img width="100" height="125" alt="fourth-card" src={this.state.fourthImgUrl || ''}></img>
                    </div>
                )
            }
        }
    }

    render() {
        return (
            <div className="container" >
                <div className="setup_game" style={divStyle}>
                    {!this.state.gameSet && <div style={divStyle}>
                        <Box m={2}>
                            <TextField id="numPlayers" label="Number of players" value={this.state.numPlayers} onChange={this.handleNumPlayersFieldChange} helperText="Please enter the number of players" />
                        </Box>
                        <Box m={2}>
                            <TextField id="numCards" label="Number of cards" value={this.state.numCards} onChange={this.handleNumCardsFieldChange} helperText="Please enter the number of cards" />
                        </Box>
                        <Box m={2} pt={3}>
                            <Button variant="contained" color="secondary" onClick={this.generate.bind(this)}>SETUP GAME</Button>
                        </Box> </div>}
                </div><br /><br />
                <Box>
                    <Button size="large" variant="outlined" color="primary" >Hello, {this.state.displayName}</Button>
                </Box>
                <div className="logout_reset" style={divStyle}>
                    <Box m={2}>
                        <Button variant="contained" color="primary" onClick={this.logout.bind(this)} >Logout</Button>
                    </Box>
                    <Box m={2}>
                        <Button variant="contained" color="primary" onClick={this.resetGame.bind(this)} >Reset Game</Button>
                    </Box>
                </div>
                <div className="logout_reset" style={divStyle}>
                    <Box m={2}>
                        <Button variant="contained" color="primary" onClick={this.getCards.bind(this)} disabled={!this.getEnableSee()} >See Cards</Button>
                    </Box>
                    <Box m={2}>
                        <Button style={{ backgroundColor: 'crimson' }} variant="contained" color="primary" onClick={this.packed.bind(this)} disabled={!this.getEnablePack()} >Pack</Button>
                    </Box>
                    <Box m={2}>
                        <Button style={{ backgroundColor: 'green' }} variant="contained" color="primary" onClick={this.showCards.bind(this)} disabled={!this.getEnableShow()} >Show Cards</Button>
                    </Box>
                </div>
                <div style={horizontal}>
                    <h2>Your cards are:</h2>
                    {this.renderCardsPictures()}
                </div>
                <div ref="cardsStats">
                    {this.renderStats()}
                </div>
            </div >
        );
    }

    handleNumPlayersFieldChange(e) {
        e.preventDefault()
        const num = e.target.value
        this.setState({
            numPlayers: num
        })
    }

    handleNumCardsFieldChange(e) {
        e.preventDefault()
        const num = e.target.value
        this.setState({
            numCards: num
        })
    }

    // Util methods
    getCellColor(row) {
        if (row.status == 'BLIND') {
            return 'black'
        } else if (row.status == 'PACK') {
            return 'crimson'
        } else if (row.status == 'SEEN') {
            return 'royalblue'
        } else {
            return 'green'
        }
    }

    getRealCardsMessage(urls) {
        const cardsNum = this.state.numCards
        if (this.state.gameSet && urls != null && urls.length > 0) {
            if (cardsNum == 1) {
                return (
                    <div style={horizontal}>
                        <img width="100" height="125" alt="first-card" src={urls[0] || ''}></img>
                    </div>
                )
            } else if (cardsNum == 2) {
                return (
                    <div style={horizontal}>
                        <img width="100" height="125" alt="first-card" src={urls[0] || ''}></img>
                        <img width="100" height="125" alt="second-card" src={urls[1] || ''}></img>
                    </div>
                )
            } else if (cardsNum == 3) {
                return (
                    <div style={horizontal}>
                        <img width="100" height="125" alt="first-card" src={urls[0] || ''}></img>
                        <img width="100" height="125" alt="second-card" src={urls[1] || ''}></img>
                        <img width="100" height="125" alt="third-card" src={urls[2] || ''}></img>
                    </div>
                )
            } else if (cardsNum == 4) {
                return (
                    <div style={horizontal}>
                        <img width="100" height="125" alt="first-card" src={urls[0] || ''}></img>
                        <img width="100" height="125" alt="second-card" src={urls[1] || ''}></img>
                        <img width="100" height="125" alt="third-card" src={urls[2] || ''}></img>
                        <img width="100" height="125" alt="fourth-card" src={urls[3] || ''}></img>
                    </div>
                )
            }
        }
    }

    getFirstRealCard() {
        fire.database().ref('cards/' + this.state.cardIndicies[0]).once('value').then((snap => {
            this.storeFirstCard(snap.val())
        })).then((u) => {
            fire.storage().ref('/').child(`${this.getFirstCard().fullName}.png`).getDownloadURL().then(url => {
                this.storeFirstCardURL(url)
            }).then((u) => {
                fire.database().ref('users/list/' + fire.auth().currentUser.uid + '/cards/urls').update({ 0: this.getFirstCardURL() })
            })
        })
    }

    getSecondRealCard() {
        this.getFirstRealCard()
        fire.database().ref('cards/' + this.state.cardIndicies[1]).once('value').then((snap => {
            this.storeSecondCard(snap.val())
        })).then((u) => {
            fire.storage().ref('/').child(`${this.getSecondCard().fullName}.png`).getDownloadURL().then(url => {
                this.storeSecondCardURL(url)
            }).then((u) => {
                fire.database().ref('users/list/' + fire.auth().currentUser.uid + '/cards/urls').update({ 1: this.getSecondCardURL() })
            })
        });
    }

    getThirdRealCard() {
        this.getFirstRealCard()
        this.getSecondRealCard()
        fire.database().ref('cards/' + this.state.cardIndicies[2]).once('value').then((snap => {
            this.storeThirdCard(snap.val())
        })).then((u) => {
            fire.storage().ref('/').child(`${this.getThirdCard().fullName}.png`).getDownloadURL().then(url => {
                this.storeThirdCardURL(url)
            }).then((u) => {
                fire.database().ref('users/list/' + fire.auth().currentUser.uid + '/cards/urls').update({ 2: this.getThirdCardURL() })
            })
        });
    }

    getFourthRealCard() {
        this.getFirstRealCard()
        this.getSecondRealCard()
        this.getThirdRealCard()
        fire.database().ref('cards/' + this.state.cardIndicies[3]).once('value').then((snap => {
            this.storeFourthCard(snap.val())
        })).then((u) => {
            fire.storage().ref('/').child(`${this.getFourthCard().fullName}.png`).getDownloadURL().then(url => {
                this.storeFourthCardURL(url)
            }).then((u) => {
                fire.database().ref('users/list/' + fire.auth().currentUser.uid + '/cards/urls').update({ 3: this.getFourthCardURL() })
            })
        });
    }

    // Store and get from local storage
    storeCardIndicies(indicies) {
        localStorage.setItem('cardIndicies', JSON.stringify(indicies))
        this.setState({ cardIndicies: indicies })
    }

    storeFirstCard(card) {
        localStorage.setItem('firstCard', JSON.stringify(card))
        this.setState({ firstCard: card })
    }

    storeSecondCard(card) {
        localStorage.setItem('secondCard', JSON.stringify(card))
        this.setState({ secondCard: card })
    }

    storeThirdCard(card) {
        localStorage.setItem('thirdCard', JSON.stringify(card))
        this.setState({ thirdCard: card })
    }

    storeFourthCard(card) {
        localStorage.setItem('fourthCard', JSON.stringify(card))
        this.setState({ fourthCard: card })
    }

    storeFirstCardURL(url) {
        localStorage.setItem('firstCardURL', JSON.stringify(url))
        this.setState({ firstImgUrl: url })
    }

    storeSecondCardURL(url) {
        localStorage.setItem('secondCardURL', JSON.stringify(url))
        this.setState({ secondImgUrl: url })
    }

    storeThirdCardURL(url) {
        localStorage.setItem('thirdCardURL', JSON.stringify(url))
        this.setState({ thirdImgUrl: url })
    }

    storeFourthCardURL(url) {
        localStorage.setItem('fourthCardURL', JSON.stringify(url))
        this.setState({ fourthImgUrl: url })
    }

    storeEnableSee(val) {
        localStorage.setItem('enableSee', JSON.stringify(val))
        this.setState({ enableSee: val })
    }

    storeEnablePack(val) {
        localStorage.setItem('enablePack', JSON.stringify(val))
        this.setState({ enablePack: val })
    }

    storeEnableShow(val) {
        localStorage.setItem('enableShow', JSON.stringify(val))
        this.setState({ enableShow: val })
    }

    storePacked() {
        localStorage.setItem('enableSee', JSON.stringify(false))
        localStorage.setItem('enablePack', JSON.stringify(false))
        localStorage.setItem('enableShow', JSON.stringify(false))
        this.setState({
            enableSee: false,
            enablePack: false,
            enableShow: false
        })
    }

    getCardIndicies() {
        return JSON.parse(localStorage.getItem('cardIndicies')) || []
    }

    getFirstCard() {
        return JSON.parse(localStorage.getItem('firstCard')) || ''
    }

    getSecondCard() {
        return JSON.parse(localStorage.getItem('secondCard')) || ''
    }

    getThirdCard() {
        return JSON.parse(localStorage.getItem('thirdCard')) || ''
    }

    getFourthCard() {
        return JSON.parse(localStorage.getItem('fourthCard')) || ''
    }

    getFirstCardURL() {
        return JSON.parse(localStorage.getItem('firstCardURL')) || ''
    }

    getSecondCardURL() {
        return JSON.parse(localStorage.getItem('secondCardURL')) || ''
    }

    getThirdCardURL() {
        return JSON.parse(localStorage.getItem('thirdCardURL')) || ''
    }

    getFourthCardURL() {
        return JSON.parse(localStorage.getItem('fourthCardURL')) || ''
    }

    getEnableSee() {
        if (JSON.parse(localStorage.getItem('enableSee') == null)) {
            return true
        } else {
            return JSON.parse(localStorage.getItem('enableSee'))
        }
    }

    getEnablePack() {
        if (JSON.parse(localStorage.getItem('enablePack') == null)) {
            return false
        } else {
            return JSON.parse(localStorage.getItem('enablePack'))
        }
    }

    getEnableShow() {
        if (JSON.parse(localStorage.getItem('enableShow') == null)) {
            return false
        } else {
            return JSON.parse(localStorage.getItem('enableShow'))
        }
    }
}

export default Cards