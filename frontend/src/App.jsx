import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AddManager from "./pages/AddManager";
import WareHouseManager from "./pages/WareHouseManager";

import AddFarmer from "./pages/AddFarmer.JSX";
import LocalFarmer from "./pages/LocalFarmer";

import AddNutritionist from "./pages/AddNutritionist";
import Nutritionist from "./pages/Nutritionist";

import AddAnimalRecord from "./pages/AddAnimalRecord";
import AnimalRecord from "./pages/AnimalRecord";

import AddMeatProduct from "./pages/AddMeatProduct";
import MeatProducts from "./pages/MeatProducts";

import AddMeatPrepProcedure from "./pages/AddMeatPrepProcedure";
import MeatPrepProcedure from "./pages/MeatPrepProcedure";

import EnvironmentalConditions from "./pages/EnvironmentalConditions";

import AddSalesDistribution from "./pages/AddSalesDistribution";
import SalesDistribution from "./pages/SalesDistribution";

import AddLossTracking from "./pages/AddLossTracking";
import LossTracking from "./pages/LossTracking";

import AddAlert from "./pages/AddAlert";
import Alerts from "./pages/Alerts";

import AddPreventativeMeasure from "./pages/AddPreventativeMeasure";
import PreventativeMeasures from "./pages/PreventativeMeasures";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="" element={<Dashboard />} />

          <Route path="/wareHouse" element={<WareHouseManager />} />
          <Route path="/addmanager" element={<AddManager />} />

          <Route path="/farmers" element={<LocalFarmer />} />
          <Route path="/addfarmer" element={<AddFarmer />} />

          <Route path="/animalrecord" element={<AnimalRecord />} />
          <Route path="/addanimalrecord" element={<AddAnimalRecord />} />

          <Route path="/nutritionists" element={<Nutritionist />} />
          <Route path="/addnutritionist" element={<AddNutritionist />} />

          <Route path="/meatprep" element={<MeatPrepProcedure />} />
          <Route path="/addmeatprep" element={<AddMeatPrepProcedure />} />

          <Route path="/meatproducts" element={<MeatProducts />} />
          <Route path="/addmeatproduct" element={<AddMeatProduct />} />

          <Route
            path="/environmentalconditions"
            element={<EnvironmentalConditions />}
          />

          <Route path="/salesdistribution" element={<SalesDistribution />} />
          <Route
            path="/addsalesdistribution"
            element={<AddSalesDistribution />}
          />

          <Route path="/losstracking" element={<LossTracking />} />
          <Route path="/addlosstracking" element={<AddLossTracking />} />

          <Route path="/alerts" element={<Alerts />} />
          <Route path="/addalerts" element={<AddAlert />} />

          <Route
            path="/preventativemeasures"
            element={<PreventativeMeasures />}
          />
          <Route
            path="/addpreventativemeasures"
            element={<AddPreventativeMeasure />}
          />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
