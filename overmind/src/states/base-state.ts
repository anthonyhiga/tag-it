import { BaseState as State } from "../state-machine";
import { SMModel } from "../base-types";

export abstract class BaseState<Props> extends State<Props, SMModel> {}
