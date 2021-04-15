import Contemplations from "./components/Contemplations";
import { transform } from "@babel/core";
import preset from "@babel/preset-react";
import React from 'react';

const App = () =>  {
  // let test = transform('({args}) => <div>{args.header}</div>', {presets: [[preset]]})
  // console.log(test.code)
  // const func = new Function("React", `return ${test.code}`);
  // console.log(func)
  // const Test = func(React)
  return (
  <>
   <Contemplations sheetId={"16oebHDZ46f7noY1fEn7EaiJ8f1CtxfO0Fd0R2jsODfo"}/>
    {/* <Test args={{header: 'test'}}/> */}
   </>
  );
}

export default App;
