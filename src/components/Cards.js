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
        this.getCardsMessage = this.getCardsMessage.bind(this);

        this.state = {
            cardIndicies: [],
            firstCard: [],
            secondCard: [],
            thirdCard: [],
            fourthCard: [],
            playerStats: [],
            message: '',
            numPlayers: 0,
            numCards: 3,
            userState: this.props.userState,
            displayName: '',
            gameSet: true
        }
    }

    componentDidUpdate() {
        this.scrollToBottom()
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
                numPlayers: parseInt(snapVal.numPlayers)
            })
        })

        fire.database().ref('users/list').on('child_changed', snap => {
            this.updateTable()
        })

        this.updateTable()
        this.scrollToBottom()
    }

    updateTable() {
        this.setState({ playerStats: [] })
        fire.database().ref('users').child('list').once('value').then((snap) => {
            snap.forEach((user) => {
                if (user.val().isLoggedIn) {
                    var name = user.val().name
                    var status = user.val().status
                    var message = user.val().showCardsMessage
                    if (status == 'SHOW') {
                        this.setState({
                            playerStats: this.state.playerStats.concat({ name, status, message })
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
        fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({
            cards: null,
            isLoggedIn: false,
            status: 'BLIND',
            showCardsMessage: ''
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
        // update isGameSet to database after reset game
        var updates = {};
        var ref = fire.database().ref('users/')
        updates['isGameSet'] = false;

        this.setState({
            gameSet: false,
            firstCard: [],
            secondCard: [],
            thirdCard: [],
            fourthCard: [],
            message: '',
            playerStats: []
        })

        ref.update(updates).then((u) => {
            fire.database().ref('users').child('list').once('value').then((snap) => {
                snap.forEach((user) => {
                    if (user.val().isLoggedIn) {
                        fire.database().ref('users/list/' + user.key).update({
                            cards: null,
                            status: 'BLIND',
                            showCardsMessage: ''
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
                this.setState({ cardIndicies: snap.val() })
                this.getRealCards()
            })).then((u) => {
                fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({ status: 'SEEN' })
            })
        } else {
            console.log("Trying to get cards when you're not in a game")
        }
    }

    getRealCards() {
        const cardsNum = this.state.numCards
        if (cardsNum == 1) {
            fire.database().ref('cards/' + this.state.cardIndicies[0]).once('value').then((snap => {
                this.setState({ firstCard: snap.val() })
            }));
        } else if (cardsNum == 2) {
            fire.database().ref('cards/' + this.state.cardIndicies[0]).once('value').then((snap => {
                this.setState({ firstCard: snap.val() })
            })).then((u) => {
                fire.database().ref('cards/' + this.state.cardIndicies[1]).once('value').then((snap => {
                    this.setState({ secondCard: snap.val() })
                }));
            });
        } else if (cardsNum == 3) {
            fire.database().ref('cards/' + this.state.cardIndicies[0]).once('value').then((snap => {
                this.setState({ firstCard: snap.val() })
            })).then((u) => {
                fire.database().ref('cards/' + this.state.cardIndicies[1]).once('value').then((snap => {
                    this.setState({ secondCard: snap.val() })
                })).then((u) => {
                    fire.database().ref('cards/' + this.state.cardIndicies[2]).once('value').then((snap => {
                        this.setState({ thirdCard: snap.val() })
                    }))
                });
            });
        } else if (cardsNum == 4) {
            fire.database().ref('cards/' + this.state.cardIndicies[0]).once('value').then((snap => {
                this.setState({ firstCard: snap.val() })
            })).then((u) => {
                fire.database().ref('cards/' + this.state.cardIndicies[1]).once('value').then((snap => {
                    this.setState({ secondCard: snap.val() })
                })).then((u) => {
                    fire.database().ref('cards/' + this.state.cardIndicies[2]).once('value').then((snap => {
                        this.setState({ thirdCard: snap.val() })
                    })).then((u) => {
                        fire.database().ref('cards/' + this.state.cardIndicies[3]).once('value').then((snap => {
                            this.setState({ fourthCard: snap.val() })
                        }));
                    });
                });
            });
        } else {
            fire.database().ref('cards/' + this.state.cardIndicies[0]).once('value').then((snap => {
                this.setState({ firstCard: snap.val() })
            })).then((u) => {
                fire.database().ref('cards/' + this.state.cardIndicies[1]).once('value').then((snap => {
                    this.setState({ secondCard: snap.val() })
                })).then((u) => {
                    fire.database().ref('cards/' + this.state.cardIndicies[2]).once('value').then((snap => {
                        this.setState({ thirdCard: snap.val() })
                    }))
                });
            });
        }
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

    packed(e) {
        e.preventDefault()
        fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({ status: 'PACK' })
    }

    showCards(e) {
        e.preventDefault()
        var msg = this.getCardsMessage()

        this.setState({ message: msg })
        fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({
            status: 'SHOW',
            showCardsMessage: msg
        })
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
                                    <td><h3>{row.message}</h3></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>)
    }

    renderCards() {
        return (
            <div style={horizontal}>
                <h2>{this.getCardsMessage()}</h2>
            </div >
        )
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
                        <Button variant="contained" color="primary" onClick={this.getCards.bind(this)} >See Cards</Button>
                    </Box>
                    <Box m={2}>
                        <Button variant="contained" color="secondary" onClick={this.packed.bind(this)} >Pack</Button>
                    </Box>
                    <Box m={2}>
                        <Button variant="contained" color="primary" onClick={this.showCards.bind(this)} >Show Cards</Button>
                    </Box>
                </div>
                <div style={horizontal}>
                    <h2>Your cards are:</h2>
                    {this.renderCards()}
                </div>
                <div ref="cardsStats">
                    {this.renderStats()}
                </div>
            </div >
        );
    }

    // Util methods
    getCellColor(row) {
        if (row.status == 'BLIND') {
            return 'royalblue'
        } else if (row.status == 'PACK') {
            return 'crimson'
        } else {
            return 'green'
        }
    }

    getCardsMessage() {
        const cardsNum = this.state.numCards
        var msg = '';
        if (this.state.gameSet && this.state.cardIndicies.length > 0) {
            if (cardsNum == 1) {
                msg = msg + `${this.state.firstCard.card} ${this.state.firstCard.suit}`
            } else if (cardsNum == 2) {
                msg = msg + `${this.state.firstCard.card} ${this.state.firstCard.suit}, ${this.state.secondCard.card} ${this.state.secondCard.suit}`
            } else if (cardsNum == 3) {
                msg = msg + `${this.state.firstCard.card} ${this.state.firstCard.suit}, ${this.state.secondCard.card} ${this.state.secondCard.suit}, ${this.state.thirdCard.card} ${this.state.thirdCard.suit}`
            } else if (cardsNum == 4) {
                msg = msg + `${this.state.firstCard.card} ${this.state.firstCard.suit}, ${this.state.secondCard.card} ${this.state.secondCard.suit}, ${this.state.thirdCard.card} ${this.state.thirdCard.suit}, ${this.state.fourthCard.card} ${this.state.fourthCard.suit}`
            }
        }

        return msg
    }
}

export default Cards