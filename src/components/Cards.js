import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import fire from 'firebase'

var URL = "https://us-central1-teen-patti-5a5fc.cloudfunctions.net"
const divStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

class Cards extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
        this.handleNumPlayersFieldChange = this.handleNumPlayersFieldChange.bind(this);
        this.generate = this.generate.bind(this);
        this.getCards = this.getCards.bind(this);
        this.getRealCards = this.getRealCards.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.state = {
            cardIndicies: [],
            firstCard: [],
            secondCard: [],
            thirdCard: [],
            cards: [],
            numPlayers: '',
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
    }

    logout() {
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
        fire.database().ref().update(updates);

        this.setState((state) => {
            return {gameSet : !state.gameSet}
        })

        console.log('resetGame: ' + this.state.gameSet)
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

        for (let j = 0; j < this.state.numPlayers; j++) {
            cardsTrips[j] = [cardsSet.next().value, cardsSet.next().value, cardsSet.next().value]
        }

        console.log(cardsTrips);
        this.setState({ gameSet: true })

        // update isGameSet to database
        var updates = {};
        updates['users/' + 'isGameSet'] = true;
        fire.database().ref().update(updates);

        var i = 0;
        fire.database().ref('users').child('list').once('value', snap => {
            snap.forEach((user) => {
                fire.database().ref('users/list/' + user.key).update({ cards: cardsTrips[i] })
                i++;
            })
        });
    }

    getCards(e) {
        e.preventDefault()
        fire.database().ref('users/list/' + fire.auth().currentUser.uid + '/cards').once('value').then((snap => {
            this.setState({ cardIndicies: snap.val()})
            this.getRealCards()
        }));
    }

    getRealCards() {
        fire.database().ref('cards/' + this.state.cardIndicies[0]).once('value').then((snap => {
            this.setState({ firstCard: snap.val()})
        }));

        fire.database().ref('cards/' + this.state.cardIndicies[1]).once('value').then((snap => {
            this.setState({ secondCard: snap.val()})
        }));

        fire.database().ref('cards/' + this.state.cardIndicies[2]).once('value').then((snap => {
            this.setState({ thirdCard: snap.val()})
        }));
    }

    renderCards() {
        return (
            <div>
                <h3>The first card is: {this.state.firstCard.card} {this.state.firstCard.suit}</h3>
                <h3>The second card is: {this.state.secondCard.card} {this.state.secondCard.suit}</h3>
                <h3>The third card is: {this.state.thirdCard.card} {this.state.thirdCard.suit}</h3>
            </div>
        )
    }

    handleNumPlayersFieldChange(e) {
        e.preventDefault()
        this.setState({
            numPlayers: e.target.value
        })
    }

    render() {
        return (
            <div className="container">
                <div className="top_row" style={divStyle}>
                    {!this.state.gameSet && <div style={divStyle}>
                        <Box>
                            <TextField id="numPlayers" label="Number of players" value={this.state.numPlayers} onChange={this.handleNumPlayersFieldChange} helperText="Please enter the number of players" />
                        </Box>
                        <Box m={2} pt={3}>
                            <Button variant="contained" color="secondary" onClick={this.generate.bind(this)}>SETUP GAME</Button>
                        </Box> </div>}
                </div><br /><br />
                <Box m={2}>
                    <Button variant="contained" color="primary" onClick={this.logout.bind(this)} >Logout</Button>
                </Box>
                <Box m={2}>
                    <Button variant="contained" color="primary" onClick={this.resetGame.bind(this)} >Reset Game</Button>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={this.getCards.bind(this)} >Get Cards</Button>
                </Box>
                <h2>Your cards are:</h2>
                {this.renderCards()}
            </div>
        );
    }
}

export default Cards