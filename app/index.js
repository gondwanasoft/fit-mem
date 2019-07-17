import * as fs from "fs";
import { memory } from "system";

let moduleObject;   // we reuse this variable so that previously-loaded modules become unreferenced and can then be garbage-collected
let answer;

// Swap module1 and module2 lots of times:
for (let i=0; i<100; i++) {
  // Load module1 and execute a method within it:
  moduleObject = loadModule('module1', 3, 1);
  answer = moduleObject.API1(6);
  console.log(`module1 answer = ${answer}`);  // should be 6*3+1

  // Load module2 and execute a method within it:
  moduleObject = loadModule('module2', 3, 1);
  answer = moduleObject.API1(6);  // the method (API1) doesn't have to be called the same as it was in module1; I do it here to show the code is different
  console.log(`module2 answer = ${answer}`);  // should be 6/3-1

  console.log("memory free=" + (memory.js.total-memory.js.used));
}

function loadModule(moduleName, var1, var2) {
  // moduleName: filename of module, without .txt extension.
  // var1, var2: optional values to be passed to module constructor.
  // Returns an instance of the object defined and instantiated in moduleName.txt.
  // This function may require a fair bit of memory to be available because it juggles the module code through multiple types (eg, string, Function).
  // It may be possible to reduce this by eliminating intermediate variables.
  // The process may still be useful if multiple small modules can be used, rather than using just a few large modules.

  // Read the module text file into a string:
  const moduleString = fs.readFileSync(`/mnt/assets/resources/${moduleName}.txt`, "utf-8");
  //console.log("moduleString="); console.log(`${moduleString}`); console.log("End of moduleString.");

  // Create a function that can construct an object of the type declared in the string:
  const moduleConstructor = new Function('var1', 'var2', moduleString);

  // Execute the constructor function to get an object:
  return moduleConstructor(var1, var2);
}