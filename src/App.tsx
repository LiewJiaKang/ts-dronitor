import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full sm:w-1/2">
        <h1 className="text-[64px]">Dronitor</h1>
        <p>
          Dronitor is an innovative drone-based system designed to detect and
          measure VOCs and PM2.5 in real-time, offering a cost-effective
          solution for air quality monitoring in urban, industrial, and remote
          areas.
        </p>
        <br />
        <Button variant={"outline"}>
          <a href="./documentation">Get started</a>
        </Button>
      </div>
    </div>
  );
}
export default App;
