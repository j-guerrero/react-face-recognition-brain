import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js'
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import './App.css';

const particlesOptions = {
  particles: {
    number:{
      value: 300,
      density: {
        enable: false,
      }
    },
    size: {
      value: 7,
      random: true,
      anim: {
        speed: 2,
        size_min:1
      }
    },
    line_linked: {
      enable: true
    },
    move: {
      random: true,
      speed: 1,
      direction: "top",
      out_mode: "out"
    },
  }
}


const intialState = {
      input: '',
      imageUrl:'',
      boxes: [],
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

class  App extends Component {

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:'',
      boxes: [],
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

  calculateFaceLocations = (data) => {

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


  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };

  onButtonSubmit = () =>{

    const { input, user } = this.state;

    this.setState({imageUrl: input});

    fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          input: input
         })
      })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type':'application/json'},
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
      .catch(err => console.log(err));
  };

  onRouteChange = (route) => {

    if (route === 'sign-out'){
      this.setState(intialState)
      this.setState({route: 'sign-in'});
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
      
      this.setState({route: route});    
  };

  render(){

    const { isSignedIn, imageUrl, route, boxes, user } = this.state;

    return (
      <div className="App">
        <Particles className = 'particles' params={particlesOptions} />

        <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' ?
          <div>
                <Logo />
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
