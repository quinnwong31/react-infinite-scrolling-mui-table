import logo from "./logo.svg";
import "./App.css";
import VirtualizedTableWithStreamText from "./VirtualizedTableWithStreamText";
import FollowOutputExample from "./components/FollowOutputExample";
import VirtualizedTableWithTestData from "./ReactVirtualizedWithTestData";
import ReactVirtualizedWithTestData from "./ReactVirtualizedWithTestData";
import ReactVirtualizedWithStreamText from "./ReactVirtualizedWithStreamText";
function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <VirtualizedTableWithStreamText /> */}
      {/* <VirtualizedTableWithTestData /> */}
      {/* <VirtualizedTable /> */}
      {/* <FollowOutputExample /> */}

      {/* <ReactVirtualizedWithTestData /> */}
      <ReactVirtualizedWithStreamText />
    </div>
  );
}

export default App;
