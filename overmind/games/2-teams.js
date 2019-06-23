const StateMachine = require('javascript-state-machine');

class BaseState {
  onChannelUpdated(channel) {
    console.log(channel);
  }
}

const fsm = new StateMachine({
  init: 'setup',
  transitions: [
    { name: 'register', from: 'setup', to: 'registration' },
    { name: 'start', from: 'registration', to: 'running' },
    { name: 'score', from: 'running', to: 'scoring' },
    { name: 'complete', from: 'scoring', to: 'complete' }
  ],
  data: {
    states: {
      'setup': new BaseState(),
      'registration': new BaseState(),
      'running': new BaseState(),
      'scoring': new BaseState(),
      'complete': new BaseState(),
    }
  },
  methods: {
    getState: function() {
      return this.states[this.state];
    }
  }
});

module.export = fsm
