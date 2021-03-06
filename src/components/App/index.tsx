import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

import { useRealmApp, RealmAppProvider } from "./RealmApp"

import LogIn from '../utils/LogIn'
import Confirmation from '../utils/Confirmation'
import ResetPassword from '../utils/ResetPassword'
import ResetPasswordConfirm from "../utils/ResetPasswordConfirm"
import Framework from '../Framework'
import RequireRole from '../utils/RequireRole'
import { Role } from '../../types/index';
import MyFindings from '../MyFindings'
import FindingDetails from '../MyFindings/FindingDetails'
import FindingsOverview from '../FindingsOverview/index';
import FindingDetailsAdmin from '../FindingsOverview/FindingDetails/index';
import Settings from '../Settings'
import InformationPage from '../Information'
import ProductOwnerOverview from '../ProductOwnerOverview'
import FindingDetailsPO from '../ProductOwnerOverview/FindingDetails'
import Archive from '../Archive'
import FindingDetailsArchive from '../Archive/FindingDetails'

const REALM_APP_ID = "rivm_gat-lkoaf"

interface IProps { }

// renders children if there is a logged in user, else renders login component
const RequireLoggedInUser: React.FC<IProps> = ({ children }) => {
  const app: any = useRealmApp()
  return app.currentUser ? <>{children}</> : <LogIn />
}

const App = () => {
  return (
    <RealmAppProvider appId={REALM_APP_ID}>
      <Router>
        <Switch>
          <Route exact path="/confirmation">
            <Confirmation />
          </Route>
          <Route exact path="/resetpassword/:email">
            <ResetPassword />
          </Route>
          <Route exact path="/resetpassword/">
            <ResetPassword />
          </Route>
          <Route path="/resetpasswordconfirm">
            <ResetPasswordConfirm />
          </Route>
          <Route exact path="/">
            <RequireLoggedInUser>
              <Framework>
                <MyFindings />
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/findings">
            <RequireLoggedInUser>
              <Framework>
                <MyFindings />
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/findings/new">
            <RequireLoggedInUser>
              <Framework>
                <FindingDetails />
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/findings/:id">
            <RequireLoggedInUser>
              <Framework>
                <FindingDetails />
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/findingsoverview">
            <RequireLoggedInUser>
              <Framework>
                <RequireRole role={Role.test_coordinator}>
                  <FindingsOverview />
                </RequireRole>
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/findingsoverview/:id">
            <RequireLoggedInUser>
              <Framework>
                <RequireRole role={Role.test_coordinator}>
                  <FindingDetailsAdmin />
                </RequireRole>
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/productowneroverview">
            <RequireLoggedInUser>
              <Framework>
                <RequireRole role={Role.product_owner}>
                  <ProductOwnerOverview />
                </RequireRole>
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/productowneroverview/:id">
            <RequireLoggedInUser>
              <Framework>
                <RequireRole role={Role.product_owner}>
                  <FindingDetailsPO />
                </RequireRole>
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/settings">
            <RequireLoggedInUser>
              <Framework>
                <RequireRole role={Role.test_coordinator}>
                  <Settings />
                </RequireRole>
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/information">
            <RequireLoggedInUser>
              <Framework>
                <InformationPage />
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/archive">
            <RequireLoggedInUser>
              <Framework>
                <RequireRole role={Role.test_coordinator}>
                  <Archive />
                </RequireRole>
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route exact path="/archive/:id">
            <RequireLoggedInUser>
              <Framework>
                <RequireRole role={Role.test_coordinator}>
                  <FindingDetailsArchive />
                </RequireRole>
              </Framework>
            </RequireLoggedInUser>
          </Route>
          <Route path="/">
            <RequireLoggedInUser>
              <Framework>
                <MyFindings />
              </Framework>
            </RequireLoggedInUser>
          </Route>
        </Switch>
      </Router>
    </RealmAppProvider>
  )
}

export default App
