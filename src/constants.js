export const particlesOptions = {
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
      enable: false
    },
    move: {
      random: true,
      speed: 1,
      direction: "top",
      out_mode: "out"
    },
    interactivity: {
      events: {
        onresize: {
          enable: true,
          denisty_auto: true,
          density_area: 400
        }
      }
    }
  }
};

export const intialState = {
      input: '',
      imageUrl:'',
      boxes: [],
      route: 'sign-in',
      isSignedIn: false,
      isProfileOpen: false,
      user: {
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined : ''
      }
}