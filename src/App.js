import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js'
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import './App.css';

const app = new Clarifai.App({
 apiKey: '919b7214df03445b89c5baefb21954b9'
});

const particlesOptions = {
  particles: {
    number:{
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    },
    size: {
      value: 0
    }
  }
}



class  App extends Component {

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: [],
      route: 'sign-in',
      isSignedIn: false,
      user: {
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined : ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({ user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined : data.joined
    }})
  }

  calculateFaceLocation = (data) => {

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
  }


  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models
      .predict(
          Clarifai.FACE_DETECT_MODEL, 
          this.state.input)
      .then(response => {
        if(response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
             })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
        
      .catch(err => console.log(err));
  };

  onRouteChange = (route) => {

    if (route === 'sign-out'){
      this.setState({isSignedIn: false})
      this.setState({route: 'sign-in'});
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
      
      this.setState({route: route});    
  };

  render(){

    const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className="App">
        <Particles className = 'particles' params={particlesOptions} />

        <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' ?
          <div>
                <Logo />
                <Rank name={this.state.user.name} entries ={this.state.user.entries} />
                <ImageLinkForm 
                  onInputChange = {this.onInputChange} 
                  onButtonSubmit = {this.onButtonSubmit} 
                />
                <FaceRecognition box={box} imageUrl={imageUrl} />
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
