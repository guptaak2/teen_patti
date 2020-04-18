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
        this.getMessages = this.getMessages.bind(this);
        this.packed = this.packed.bind(this);
        this.showCards = this.showCards.bind(this);
        this.updateTable = this.updateTable.bind(this);

        this.state = {
            cardIndicies: [],
            firstCard: [],
            secondCard: [],
            thirdCard: [],
            fourthCard: [],
            cards: [],
            messages: [],
            playerStats: [],
            numPlayers: '',
            numCards: 3,
            userState: this.props.userState,
            gameSet: true
        }
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    userState: user
                })
            }
        })

        fire.database().ref('users/isGameSet').on('value', snap => {
            this.setState({ gameSet: snap.val() })
        })

        fire.database().ref('users/numCardsPerPlayer').on('value', snap => {
            this.setState({ numCards: snap.val() })
        })

        // fire.database().ref('messages').on('value', snap => {
        //     this.setState({ messages: [] })
        //     snap.forEach((msg) => {
        //         this.setState({
        //             messages: this.state.messages.concat(msg.val().message)
        //         });
        //     })
        // })

        this.updateTable()
    }

    updateTable() {
        let id = 0;
        fire.database().ref('users').child('list').on('value', snap => {
            this.setState({ playerStats: [] })
            snap.forEach((user) => {
                if (user.val().isLoggedIn) {
                    var name = user.val().name
                    var status = user.val().status
                    this.setState({
                        playerStats: this.state.playerStats.concat({ id, name, status })
                    })
                    id++;
                }
            })
        })
    }

    getMessages() {
        return (
            <div>
                {this.state.messages.map((message, key) => {
                    return (
                        <h3 key={key}>{message}</h3>
                    )
                })}
            </div>
        )
    }

    logout() {
        fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({
            isLoggedIn: false
        })

        fire.auth().signOut().then((result) => {
            this.setState({
                userState: null
            })
        })
    }

    resetGame(e) {
        e.preventDefault()

        // update isGameSet to database after reset game
        var updates = {};
        updates['users/' + 'isGameSet'] = false;
        fire.database().ref().update(updates).then((u) => {
            var updates = {};
            updates['messages/'] = null;
            fire.database().ref().update(updates).then((u) => {
                fire.database().ref('users').child('list').once('value', snap => {
                    snap.forEach((user) => {
                        if (user.val().isLoggedIn) {
                            fire.database().ref('users/list/' + user.key).update({ cards: null })
                        }
                    })
                }).then((u) => {
                    this.setState({
                        playerStats: [],
                        gameSet: false,
                        firstCard: [],
                        secondCard: [],
                        thirdCard: [],
                        fourthCard: []
                    })
                })
            })
        })
    }

    generate(e) {
        e.preventDefault()

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

        this.setState({ gameSet: true })

        // update isGameSet to database
        var updates = {};
        updates['users/' + 'isGameSet'] = true;
        fire.database().ref().update(updates);

        // update cards to database
        var i = 0;
        fire.database().ref('users').child('list').once('value', snap => {
            snap.forEach((user) => {
                if (user.val().isLoggedIn) {
                    fire.database().ref('users/list/' + user.key).update({ cards: cardsTrips[i] })
                    i++;
                }
            })
        });
    }

    getCards(e) {
        e.preventDefault()
        if (this.state.gameSet == true) {
            fire.database().ref('users/list/' + fire.auth().currentUser.uid + '/cards').once('value').then((snap => {
                this.setState({ cardIndicies: snap.val() })
                this.getRealCards()
            })).then((u) => {
                fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({ status: 'SEEN' })
            });
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

        // fire.database().ref('messages/').push({ message: this.state.userState.displayName + ' is SEEN' })
    }

    renderCards() {
        const cardsNum = this.state.numCards
        return (
            <div style={horizontal}>
                {cardsNum == 1 &&
                    <div style={horizontal}><h2>{this.state.firstCard.card} {this.state.firstCard.suit}</h2></div>
                }

                {cardsNum == 2 &&
                    <div style={horizontal}>
                        <h2>{this.state.firstCard.card} {this.state.firstCard.suit}</h2><h2>{this.state.secondCard.card} {this.state.secondCard.suit}</h2>
                    </div>
                }

                {
                    cardsNum == 3 &&
                    <div style={horizontal}>
                        <h2>{this.state.firstCard.card} {this.state.firstCard.suit}</h2> <h2>{this.state.secondCard.card} {this.state.secondCard.suit}</h2> <h2>{this.state.thirdCard.card} {this.state.thirdCard.suit}</h2>
                    </div>
                }

                {
                    cardsNum == 4 &&
                    <div style={horizontal}>
                        <h2>{this.state.firstCard.card} {this.state.firstCard.suit}</h2><h2>{this.state.secondCard.card} {this.state.secondCard.suit}</h2><h2>{this.state.thirdCard.card} {this.state.thirdCard.suit}</h2><h2>{this.state.fourthCard.card} {this.state.fourthCard.suit}</h2>
                    </div>
                }
            </div >
        )
    }

    handleNumPlayersFieldChange(e) {
        e.preventDefault()
        this.setState({
            numPlayers: e.target.value
        })
    }

    handleNumCardsFieldChange(e) {
        e.preventDefault()
        const num = e.target.value
        // update numCards to database
        var updates = {};
        updates['users/' + 'numCardsPerPlayer'] = num;
        fire.database().ref().update(updates).then((u) => {
            this.setState({
                numCards: num
            })
        })
    }

    packed(e) {
        e.preventDefault()
        fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({ status: 'PACK' }).then((u) => {
            this.updateTable()
        })
        // fire.database().ref('messages/').push({ message: this.state.userState.displayName + ' is PACK' })
    }

    showCards(e) {
        e.preventDefault()
        const cardsNum = this.state.numCards
        var message = `${this.state.userState.displayName} is SHOW and their cards are: `
        if (cardsNum == 1) {
            message = message + `${this.state.firstCard.card} ${this.state.firstCard.suit}`
        } else if (cardsNum == 2) {
            message = message + `${this.state.firstCard.card} ${this.state.firstCard.suit} ${this.state.secondCard.card} ${this.state.secondCard.suit}`
        } else if (cardsNum == 3) {
            message = message + `${this.state.firstCard.card} ${this.state.firstCard.suit} ${this.state.secondCard.card} ${this.state.secondCard.suit} ${this.state.thirdCard.card} ${this.state.thirdCard.suit}`
        } else if (cardsNum == 4) {
            message = message + `${this.state.firstCard.card} ${this.state.firstCard.suit} ${this.state.secondCard.card} ${this.state.secondCard.suit} ${this.state.thirdCard.card} ${this.state.thirdCard.suit} ${this.state.fourthCard.card} ${this.state.fourthCard.suit}`
        }

        fire.database().ref('users/list/' + fire.auth().currentUser.uid).update({ status: 'SHOW' }).then((u) => {
            this.updateTable()
        })
        // fire.database().ref('messages/').push({ message: message })
    }

    renderStats() {
        const stats = this.state.playerStats
        return (
            <div style={table}>
                <table align="center" border="1" width="250px">
                    <thead>
                        <tr>
                            <th><h2>Name</h2></th>
                            <th><h2>Status</h2></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((row) => {
                            return (
                                <tr key={row.id}>
                                    <td><h3>{row.name}</h3></td>
                                    <td><h3>{row.status}</h3></td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>
            </div>)
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
                    <Button size="large" variant="outlined" color="primary" >Hello, {this.props.userState.displayName}</Button>
                </Box>
                <div className="logout_reset" style={divStyle}>
                    <Box m={2}>
                        <Button variant="contained" color="primary" onClick={this.logout.bind(this)} >Logout</Button>
                    </Box>
                    <Box m={2}>
                        <Button variant="contained" color="primary" onClick={this.resetGame.bind(this)} >Reset Game</Button>
                    </Box>
                </div>
                <Box m={2}>
                    <Button variant="contained" color="primary" onClick={this.getCards.bind(this)} >See Cards</Button>
                </Box>
                <Box m={2}>
                    <Button variant="contained" color="primary" onClick={this.packed.bind(this)} >Pack</Button>
                </Box>
                <Box m={2}>
                    <Button variant="contained" color="primary" onClick={this.showCards.bind(this)} >Show Cards</Button>
                </Box>
                <div style={horizontal}>
                    <h2>Your cards are:</h2>
                    {this.renderCards()}
                </div>
                {/* {this.getMessages()} */}
                {this.renderStats()}
            </div >
        );
    }
}

export default Cards