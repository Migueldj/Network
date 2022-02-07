// const [number, setNumber] = React.useState(0);
// setNumber(1)

// function well(element){
//     console.log(element);
//     setNumber(2)
//     console.log(number);
// }

function App() {
    const [number, setNumber] = React.useState(0);
    console.log(number);
    return (
        <div>
            <button onClick={() => {setNumber(number+1)}}>gg</button>
            {number}
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector("#app"));