import * as Vue from "vue";
import { log } from "../log";

function isVueRuntimeCode(code: unknown): code is string {
  return typeof code === "string" && code.includes("Vue") && code.includes("_Vue");
}

function hookVueFunction(
  NativeFunction: FunctionConstructor,
  args: unknown[]
): (...fnArgs: unknown[]) => unknown {
  const code = args[args.length - 1] as string;
  log.debug("Function hook:" + code);
  const rewrittenArgs = [...args.slice(0, -1), "with (Vue) {" + code + "}"];
  const compiled = NativeFunction(
    "Vue",
    ...(rewrittenArgs as [string, ...string[]])
  );
  return new Proxy(compiled, {
    apply(target, thisArg, argumentsList) {
      return Reflect.apply(target, thisArg, [Vue, ...argumentsList]);
    },
  });
}

globalThis.Function = new Proxy(Function, {
  construct(target, args) {
    if (isVueRuntimeCode(args[args.length - 1])) {
      return hookVueFunction(target, args);
    }
    return new target(...(args as ConstructorParameters<FunctionConstructor>));
  },
  apply(target, thisArg, args) {
    if (isVueRuntimeCode(args[args.length - 1])) {
      return hookVueFunction(target, args);
    }
    return Reflect.apply(target, thisArg, args);
  },
});
