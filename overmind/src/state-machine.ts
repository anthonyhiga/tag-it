/**
 *
 * Custom State Machine impl.  We want to construct these state maps super easily.
 * To do this we'll encapsulate all logic into the individual states w/ links purely
 * with transitions.
 *
 */

export abstract class BaseState<Props, Model extends {}> {
  sm: StateMachine<any, Model>;
  propBuild: () => Props;
  props: Props;

  constructor(propBuild: () => Props) {
    this.propBuild = propBuild;
    this.updateProps(false);
  }

  updateProps(triggerEvent: boolean) {
    const oldProps = this.props;
    this.props = this.propBuild();

    if (triggerEvent) {
      this.onUpdate(oldProps);
    }
  }

  setStateMachine(sm: StateMachine<any, Model>) {
    this.sm = sm;
  }

  onUpdate(prevProps: Props) {}

  onLeave() {}

  onEnter() {}

  abstract model(): Model;
}

export interface MachineConfig {
  initial: string;
  states: { [key: string]: BaseState<any, any> };
}

export default class StateMachine<Props, Model> {
  currentState: string = "";
  stateMap: { [key: string]: BaseState<any, Model> } = {};
  variables = {};
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  configure(map: (machine: StateMachine<Props, Model>) => MachineConfig) {
    const config = map(this);
    this.stateMap = config.states;
    this.currentState = config.initial;
  }

  start() {
    const state = this.getState();
    state.onUpdate(false);
    state.onEnter();
  }

  variable(name: string): any {
    return this.variables[name];
  }

  getState(): BaseState<any, Model> {
    return this.stateMap[this.currentState];
  }

  _setVariable(name: string, value: any) {
    this.variables[name] = value;
    this.getState().updateProps(true);
  }

  setVariable = (name: string) => {
    return (value: any) => this._setVariable(name, value);
  };

  _goto = (name: string) => {
    const nextState = this.stateMap[name];
    const lastState = this.stateMap[this.currentState];

    lastState.onLeave();
    this.currentState = name;
    nextState.updateProps(false);
    nextState.onEnter();
  };

  goto = (name: string) => {
    const closure = () => {
      this._goto(name);
    };
    return closure;
  };

  model(): Model {
    return this.getState().model();
  }
}
