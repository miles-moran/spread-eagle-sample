import axios from "axios";
import { useEffect, useState } from "react";
const Contemplations = ({ sheetId }) => {
  const url = `https://spreadsheets.google.com/feeds/worksheets/${sheetId}/public/basic?alt=json`;
  //   const [temp, setTemp] = useState({});
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
        console.log(temp);
        axios.get(homeURL).then((homeRes) => {
          const ho = readBlueprint(homeRes.data.feed.entry);
          console.log(ho);
        });
      });
    });
  }, []);
  const readBlueprint = (entries) => {
    const data = {}
    console.log("reading blueprint");
    return data
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

  return <div>contemplations</div>;
};

export default Contemplations;
