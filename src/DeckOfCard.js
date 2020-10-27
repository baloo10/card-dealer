import React, {Component} from 'react';
import Card from "./Card";
import './stylesheets/Deck.css';
import axios from "axios";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

class DeckOfCard extends Component {
    constructor(props){
        super(props);
        //every time we request a card, we gonna add this information inside drawn array
        this.state = {deck: null, drawn: [] };
        this.getCard = this.getCard.bind(this);
        
    }

    
    async componentDidMount(){
        
        //we wait until this is finished 
        let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
        //deck includes info about the respons itself, so its deck.data that has the api info we need 
        this.setState({deck: deck.data}); 

    }

    async getCard(){

        let id = this.state.deck.deck_id;
        try {
            //request a new card
            //make request using deck_id
            let cardUrl = `${API_BASE_URL}/${id}/draw/`;
            let cardRes = await axios.get(cardUrl);
                
                //if its no more cards, then give a error message
                //if its not true, then give a error
                if(!cardRes.data.success){
                    throw new Error("No card remaining")
                }

                //capture the card data here
                let card = cardRes.data.cards[0];
                this.setState (oldState => ({
                    //we set drawn to be a new array, that contains all the old data with ...oldState.draw
                    //and we also add inn a new object where we have a id, image and name
                    drawn: [
                        //copy everything from the old array ...
                        //add in a new object 
                        ...oldState.drawn, 
                        {
                            id: card.code,
                            image: card.image,
                            name: `${card.value} of ${card.suit}`
                        }
                            ]
                }));

        } catch (err) {
            alert(err)
        }
        
          //set state using new card info from api
    }

    render(){
        //we call each card c
        //then we return a card component
        const cards = this.state.drawn.map(c => (
            <Card key = {c.id} name = {c.name}  image={c.image} />
        ));
        return(
            <div>
                    <h1 className="Deck-title">♢Card Dealer♢</h1>
                    <h2 className="Deck-title subtitle"> ♢A little demo made with React♢</h2>
                    <button className="Deck-btn" onClick={this.getCard}> Get Card </button>
                    <div className="Deck-cardarea">{cards}</div>                   
            </div>
        );
    }
}

export default DeckOfCard;