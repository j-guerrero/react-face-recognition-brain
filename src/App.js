import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js'
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import { particlesOptions, initialState} from './constants.js';
import './App.css';

class  App extends Component {

  constructor(){
    super();
    this.state = initialState;
  }

  // On DOM load, check for token of previous session
  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetch('https://morning-woodland-38355.herokuapp.com/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(response => response.json())
      .then(data =>{
        if(data && data.id){
          fetch(`https://morning-woodland-38355.herokuapp.com/profile/${data.id}`, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          })
          .then(resp => resp.json())
          .then(user => {
            if (user && user.email){
              this.loadUser(user);
              this.onRouteChange('home');
            }
          })
        }
      })
      .catch(console.log)
    }
  }

  // USER DATA
  loadUser = (data) => {
    this.setState({ user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined : data.joined
    }})
  }

// <! --- FACE BOUNDING BOX FUNCTIONS --- !>
  calculateFaceLocations = (data) => {
    if(data && data.outputs){

      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);

      const boundedBoxes = data.outputs[0].data.regions.map(item =>{
        return {
          leftCol: item.region_info.bounding_box.left_col * width,
          topRow: item.region_info.bounding_box.top_row * height,
          rightCol: width - (item.region_info.bounding_box.right_col * width),
          bottomRow: height - (item.region_info.bounding_box.bottom_row * height)
        }
      })
      return boundedBoxes;
    } else { return [] }
    
  }


  displayFaceBoxes = (boxes) => {
    if(boxes){
      this.setState({boxes: boxes});
    }
    
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{

    const { input, user } = this.state;

    this.displayFaceBoxes([]);
    this.setState({imageUrl: input});

    // Post-fetch from Heroku server;
    // Recieves image URL, sends to Clarai API, and recieves return data;
    // Passes data to function that finds bounding box info and returns array to be mapped to image;
    fetch('https://morning-woodland-38355.herokuapp.com/imageurl', {
        method: 'post',
        headers: {
          'Content-Type':'application/json',
          'Authorization': window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          input: input
         })
      })
      .then(response => {
        if(response.status===200 || response.status === 204){
          return response.json();
        } else {throw Error ('Invalid image URL')}
      })
      .then(response => {
        if(response) {
          fetch('https://morning-woodland-38355.herokuapp.com/image', {
            method: 'put',
            headers: {
              'Content-Type':'application/json',
              'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
              id: user.id
             })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(user, {entries: count}))
            })
            .catch(console.log);
        }
        this.displayFaceBoxes(this.calculateFaceLocations(response));
      })
      .catch(err => {
        console.log(err);
        this.displayFaceBoxes([])
        this.setState({imageUrl: ''})
        alert("Please enter a valid image URL");
      });
  }

// <!-- END FACE FUNCTIONS -- !>

  // PAGE TRANSFER
  onRouteChange = (route) => {

    if (route === 'sign-out'){
      return this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
      this.setState({route: route});    
  }

  // MODAL
  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
        isProfileOpen: !prevState.isProfileOpen
    }))
  }

  // MAIN PAGE
  render(){

    const { isSignedIn, isProfileOpen, imageUrl, route, boxes, user } = this.state;

    return (
      <div className="App">
        <Particles className = 'particles' params={particlesOptions} />
        <div className="header">
          <Logo />
          <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange} 
            toggleModal={this.toggleModal} user={user} />
        </div>
        {isProfileOpen && 
          <Modal>
            <Profile 
              isProfileOpen={isProfileOpen} 
              toggleModal={this.toggleModal}
              loadUser={this.loadUser} 
              user={user} />
          </Modal>
        }
        { route === 'home' ?
          <div>
                <Rank name={user.name} entries ={user.entries} />
                <ImageLinkForm 
                  onInputChange = {this.onInputChange} 
                  onButtonSubmit = {this.onButtonSubmit} 
                />
                <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
         : (
              this.state.route === 'sign-in' || route === 'sign-out'
              ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
              : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
          ) 
            
          }
      </div>
    );
};
};

export default App;
