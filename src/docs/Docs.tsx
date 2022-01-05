import Sidebar from "./Sidebar"
import processRawMessageImg from "./processRawMessage.png"
import separateDevicesTooFarAwayImg from "./separateDevicesTooFarAway.png"
import convertDevicesToBridgesImg from "./convertDevicesToBridges.png"


export default function Docs() {

  return (
    <>
      <div className="h-max grid grid-cols-4 bg-gray-100 overflow-scroll pt-16 pl-16 pr-16">
        <Sidebar />
        <div className="col-span-3">
          <div>
            <img className="" src={processRawMessageImg} />
          </div>
          <div className="border-t border-em-primary">
            <img className="mt-3 mb-3" src={separateDevicesTooFarAwayImg} />
          </div>
          <div className="border-t border-em-primary">
            <img className="mt-3" src={convertDevicesToBridgesImg} />
          </div>
        </div>
      </div>
    </>

  );
}
