import React, { Component } from 'react';
import axios from 'axios'

var URL = "https://us-central1-teen-patti-5a5fc.cloudfunctions.net"

class Cards extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: [],
            message: '',
        }
    }

    componentDidMount() {
        return axios.get(URL + '/getCards').then((response) => {
            this.setState({
                cards: response.data
            })
        })
    }

    addItem(event) {
        event.preventDefault()
        const { cards } = this.state;
        const newItem = this.newItem.value;

        const isOnTheList = cards.includes(newItem)

        if (isOnTheList) {
            this.setState({
                message: 'This item is already on the list'
            })

        } else {
            return newItem !== '' && axios.post(URL + '/addCards', { item: newItem }).then((response) => {
                this.setState({
                    cards: response.data
                })
            })
        }

    }

    clearAll() {
        this.setState({
            cards: [],
            message: 'No cards in the list, add some'
        })
    }

    renderCards() {
        const { cards, message } = this.state;
        return (
            cards.map(item => {
                return <h3>{item.item}</h3>
            })
        )
    }

    render() {
        const { cards, message } = this.state;
        return (
            <div className="container">
                <h1>Your cards are:</h1>
                <form ref={input => { this.addForm = input }} className="form-inline" onSubmit={this.addItem.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="newItemInput" className="sr-only">Add New Card</label>
                        <input ref={input => { this.newItem = input }}
                            type="text" className="form-control" id="newItemInput" />
                    </div>
                    <button className="btn btn-primary">Add</button>
                </form>
                {this.renderCards()}
            </div>
        );
    }
}

export default Cards