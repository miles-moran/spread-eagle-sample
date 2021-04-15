import axios from "axios";
import { useEffect, useState } from "react";
import Block from "./Block";
const Contemplations = ({ sheetId }) => {
  const url = `https://spreadsheets.google.com/feeds/worksheets/${sheetId}/public/basic?alt=json`;
  const [page, setPage] = useState(<div>contemplations</div>);
  useEffect(() => {
    axios.get(url).then((res) => {
      const sheets = res.data.feed.entry;
      const template = sheets.find((sheet) => sheet.title.$t === "template");
      const home = sheets.find((sheet) => sheet.title.$t === "home");
      const templateURL = `${
        template.link.find((l) => l.href.includes("/cells/")).href
      }?alt=json`;
      const homeURL = `${
        home.link.find((l) => l.href.includes("/cells/")).href
      }?alt=json`;
      axios.get(templateURL).then((templateRes) => {
        const temp = readTemplate(templateRes.data.feed.entry);
        axios.get(homeURL).then((homeRes) => {
          const ho = readBlueprint(homeRes.data.feed.entry, temp);
          setPage(ho);
        });
      });
    });
  }, []);
  const readBlueprint = (entries, template) => {
    console.log(template);
    console.log("reading blueprint");
    console.log(entries);
    const children = [];
    let args = {};
    let elementType = null;
    let key = "";
    entries.forEach((entry) => {
      const cord = entry.title.$t;
      const row = cord.slice(1 - cord.length);
      const column = cord[0];
      const text = entry.content.$t;
      if (column === "A") {
        if (!elementType) {
          elementType = template[text];
        } else {
          let code = elementType.code;
          let r = code.match(/\{[\w]+\}/g);
          console.log(r);
          r &&
            r.forEach((state) => {
              var regex = new RegExp(state, "g");
              var arg = state.split(/{|}/g)[1];
              console.log("test", arg);
              code = code.replace(regex, args[arg]);
              console.log(code);
            });
          const element = <div dangerouslySetInnerHTML={{ __html: code }} />;
          children.push(element);
          elementType = template[text];
          args = {};
        }
      }
      if (column === "B") {
        key = text;
      }
      if (column === "C") {
        args[key] = text;
      }
    });
    let code = elementType.code;
    let r = code.match(/\{[\w]+\}/g);
    console.log(r);
    r &&
      r.forEach((state) => {
        var regex = new RegExp(state, "g");
        var arg = state.split(/{|}/g)[1];
        code = code.replace(regex, args[arg]);
        console.log(code);
      });
    const element = <><style>{elementType.style}</style><div dangerouslySetInnerHTML={{ __html: code }} /></>;
    children.push(element);
    return <>{children}</>;
  };

  const readTemplate = (entries) => {
    console.log("reading template");
    const header = {};
    const rows = {};
    entries.forEach((entry) => {
      const cord = entry.title.$t;
      const row = cord.slice(1 - cord.length);
      const column = cord[0];
      const text = entry.content.$t;
      if (row === "1") {
        header[column] = text;
      } else {
        if (!rows[row]) {
          rows[row] = {};
        }
        rows[row][header[column]] = text;
      }
    });
    const elements = {};
    Object.values(rows).forEach((row) => {
      elements[row["keyword"]] = row;
    });
    return elements;
  };

  return <>{page}</>;
};

export default Contemplations;
