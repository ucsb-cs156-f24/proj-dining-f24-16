import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import AppNavbarLocalhost from "main/components/Nav/AppNavbarLocalhost";

export default function AppNavbar({
  currentUser,
  systemInfo,
  doLogout,
  currentUrl = window.location.href,
}) {
  var oauthLogin = systemInfo?.oauthLogin || "/oauth2/authorization/google";
  return (
    <>
      {(currentUrl.startsWith("http://localhost:3000") ||
        currentUrl.startsWith("http://127.0.0.1:3000")) && (
        <AppNavbarLocalhost url={currentUrl} />
      )}
      <Navbar
        expand="xl"
        variant="dark"
        bg="dark"
        sticky="top"
        data-testid="AppNavbar"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            Example
          </Navbar.Brand>

          <Navbar.Toggle />

          <Nav className="me-auto">
            {systemInfo?.springH2ConsoleEnabled && (
              <>
                <Nav.Link href="/h2-console">H2Console</Nav.Link>
              </>
            )}
            {systemInfo?.showSwaggerUILink && (
              <>
                <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
              </>
            )}
          </Nav>

          <Navbar.Collapse className="justify-content-between">
            <Nav className="mr-auto">
              {hasRole(currentUser, "ROLE_ADMIN") && (
                <>
                  <NavDropdown
                    title="Admin"
                    id="appnavbar-admin-dropdown"
                    data-testid="appnavbar-admin-dropdown"
                  >
                    <NavDropdown.Item href="/admin/users">
                      Users
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/moderate">
                    Moderate
                  </Nav.Link>
                </>
              )}
              {currentUser && currentUser.loggedIn ? (
                <>
                  {/* Dining Commons Dropdown */}
                  <NavDropdown
                    title="Dining Commons"
                    id="appnavbar-diningcommons-dropdown"
                    data-testid="appnavbar-diningcommons-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/diningcommons/carrillo">
                      Carrillo
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/diningcommons/delaguerra">
                      De La Guerra
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/diningcommons/ortega">
                      Ortega
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/diningcommons/portola">
                      Ortega
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/restaurants">
                    Restaurants
                  </Nav.Link>
                  <Nav.Link as={Link} to="/ucsbdates">
                    UCSB Dates
                  </Nav.Link>
                  <Nav.Link as={Link} to="/placeholder">
                    Placeholder
                  </Nav.Link>
                  <Nav.Link as={Link} to="/myreviews">
                    My Reviews
                  </Nav.Link>
                </>
              ) : (
                <></>
              )}
            </Nav>

            <Nav className="ml-auto">
              {currentUser && currentUser.loggedIn ? (
                <>
                  <Navbar.Text className="me-3" as={Link} to="/profile">
                    Welcome, {currentUser.root.user.email}
                  </Navbar.Text>
                  <Button onClick={doLogout}>Log Out</Button>
                </>
              ) : (
                <Button href={oauthLogin}>Log In</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
