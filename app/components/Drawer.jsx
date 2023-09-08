import { Aside } from "./Aside";
import { PredictiveSearchResults } from "./Search";

export function Drawer() {
    return (
      <Aside>
        <div className="overlay">
            <PredictiveSearchResults />
        </div>
        </Aside>
    )
}

