import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CRMDashboard from './pages/CRMDashboard';
import Dashboard from './pages/Dashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import MarketingDashboard from './pages/MarketingDashboard';
import SaaSDashboard from './pages/SaaSDashboard';
import StocksDashboard from './pages/StocksDashboard';

// E-commerce pages
import AddProduct from './pages/AddProduct';
import Billing from './pages/Billing';
import CreateInvoice from './pages/CreateInvoice';
import Invoices from './pages/Invoices';
import Products from './pages/Products';
import SingleInvoice from './pages/SingleInvoice';
import SingleTransaction from './pages/SingleTransaction';
import Transactions from './pages/Transactions';

// AI Assistant
import AIAssistant from './pages/AIAssistant';

// Calendar
import Calendar from './pages/Calendar';

// Form pages
import FormElements from './pages/FormElements';
import FormLayouts from './pages/FormLayouts';
import FormValidation from './pages/FormValidation';
import FormWizards from './pages/FormWizards';

// Profile
import Profile from './pages/Profile';

// Task pages
import TaskKanban from './pages/TaskKanban';
import TaskList from './pages/TaskList';

// Table pages
import BasicTables from './pages/BasicTables';
import DataTables from './pages/DataTables';

// Pages section
import ApiKeys from './pages/ApiKeys';
import BlankPage from './pages/BlankPage';
import ComingSoon from './pages/ComingSoon';
import Error404 from './pages/Error404';
import Error500 from './pages/Error500';
import Error503 from './pages/Error503';
import FAQ from './pages/FAQ';
import FileManager from './pages/FileManager';
import Integrations from './pages/Integrations';
import Maintenance from './pages/Maintenance';
import PricingTables from './pages/PricingTables';
import Success from './pages/Success';

// Support section
import SupportChat from './pages/SupportChat';
import SupportTicketList from './pages/SupportTicketList';
import SupportTicketReply from './pages/SupportTicketReply';

// Charts section
import AreaChart from './pages/AreaChart';
import BarChart from './pages/BarChart';
import LineChart from './pages/LineChart';
import PieChart from './pages/PieChart';

// UI Elements section
import UIAlerts from './pages/UIAlerts';
import UIAvatars from './pages/UIAvatars';
import UIBadge from './pages/UIBadge';
import UIBreadcrumb from './pages/UIBreadcrumb';
import UIButtonGroup from './pages/UIButtonGroup';
import UIButtons from './pages/UIButtons';
import UICards from './pages/UICards';
import UICarousel from './pages/UICarousel';
import UIDropdowns from './pages/UIDropdowns';
import UIImages from './pages/UIImages';
import UILinks from './pages/UILinks';
import UIList from './pages/UIList';
import UIModals from './pages/UIModals';
import UINotifications from './pages/UINotifications';
import UIPagination from './pages/UIPagination';
import UIPopovers from './pages/UIPopovers';
import UIProgressBars from './pages/UIProgressBars';
import UIRibbons from './pages/UIRibbons';
import UISpinners from './pages/UISpinners';
import UITabs from './pages/UITabs';
import UITooltips from './pages/UITooltips';
import UIVideos from './pages/UIVideos';

// Authentication pages
import AuthResetPassword from './pages/AuthResetPassword';
import AuthSignIn from './pages/AuthSignIn';
import AuthSignUp from './pages/AuthSignUp';
import AuthTwoStepVerification from './pages/AuthTwoStepVerification';

// Support pages
import SupportDetails from './pages/SupportDetails';
import SupportEmail from './pages/SupportEmail';
import SupportInbox from './pages/SupportInbox';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />

              {/* Dashboard Types */}
              <Route path="ecommerce" element={<Dashboard />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="marketing" element={<MarketingDashboard />} />
              <Route path="crm" element={<CRMDashboard />} />
              <Route path="stocks" element={<StocksDashboard />} />
              <Route path="saas" element={<SaaSDashboard />} />
              <Route path="logistics" element={<LogisticsDashboard />} />

              {/* AI Assistant */}
              <Route path="ai-assistant" element={<AIAssistant />} />

              {/* Calendar */}
              <Route path="calendar" element={<Calendar />} />

              {/* Form Routes */}
              <Route path="forms/elements" element={<FormElements />} />
              <Route path="forms/layouts" element={<FormLayouts />} />
              <Route path="forms/wizards" element={<FormWizards />} />
              <Route path="forms/validation" element={<FormValidation />} />

              {/* Profile */}
              <Route path="profile" element={<Profile />} />

              {/* Task Routes */}
              <Route path="tasks/list" element={<TaskList />} />
              <Route path="tasks/kanban" element={<TaskKanban />} />

              {/* Table Routes */}
              <Route path="tables/basic" element={<BasicTables />} />
              <Route path="tables/data" element={<DataTables />} />

              {/* Pages Routes */}
              <Route path="pages/files" element={<FileManager />} />
              <Route path="pages/pricing" element={<PricingTables />} />
              <Route path="pages/faq" element={<FAQ />} />
              <Route path="pages/api-keys" element={<ApiKeys />} />
              <Route path="pages/integrations" element={<Integrations />} />
              <Route path="pages/blank" element={<BlankPage />} />
              <Route path="pages/404" element={<Error404 />} />
              <Route path="pages/500" element={<Error500 />} />
              <Route path="pages/503" element={<Error503 />} />
              <Route path="pages/coming-soon" element={<ComingSoon />} />
              <Route path="pages/maintenance" element={<Maintenance />} />
              <Route path="pages/success" element={<Success />} />

              {/* Support Routes */}
              <Route path="support/chat" element={<SupportChat />} />
              <Route path="support/email" element={<SupportEmail />} />
              <Route path="support/tickets" element={<SupportInbox />} />
              <Route path="support/tickets/:id" element={<SupportDetails />} />
              <Route path="support/tickets/list" element={<SupportTicketList />} />
              <Route path="support/tickets/reply" element={<SupportTicketReply />} />

              {/* Charts Routes */}
              <Route path="charts/line" element={<LineChart />} />
              <Route path="charts/bar" element={<BarChart />} />
              <Route path="charts/pie" element={<PieChart />} />
              <Route path="charts/area" element={<AreaChart />} />

              {/* UI Elements Routes */}
              <Route path="ui/alerts" element={<UIAlerts />} />
              <Route path="ui/buttons" element={<UIButtons />} />
              <Route path="ui/cards" element={<UICards />} />
              <Route path="ui/avatars" element={<UIAvatars />} />
              <Route path="ui/badge" element={<UIBadge />} />
              <Route path="ui/breadcrumb" element={<UIBreadcrumb />} />
              <Route path="ui/button-group" element={<UIButtonGroup />} />
              <Route path="ui/carousel" element={<UICarousel />} />
              <Route path="ui/dropdowns" element={<UIDropdowns />} />
              <Route path="ui/images" element={<UIImages />} />
              <Route path="ui/links" element={<UILinks />} />
              <Route path="ui/list" element={<UIList />} />
              <Route path="ui/modals" element={<UIModals />} />
              <Route path="ui/notifications" element={<UINotifications />} />
              <Route path="ui/pagination" element={<UIPagination />} />
              <Route path="ui/popovers" element={<UIPopovers />} />
              <Route path="ui/progress" element={<UIProgressBars />} />
              <Route path="ui/ribbons" element={<UIRibbons />} />
              <Route path="ui/spinners" element={<UISpinners />} />
              <Route path="ui/tabs" element={<UITabs />} />
              <Route path="ui/tooltips" element={<UITooltips />} />
              <Route path="ui/videos" element={<UIVideos />} />

              {/* E-commerce Routes */}
              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="billing" element={<Billing />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/single" element={<SingleInvoice />} />
              <Route path="invoices/create" element={<CreateInvoice />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/single" element={<SingleTransaction />} />
            </Route>

            {/* Authentication Routes */}
            <Route path="/auth/signin" element={<AuthSignIn />} />
            <Route path="/auth/signup" element={<AuthSignUp />} />
            <Route path="/auth/reset" element={<AuthResetPassword />} />
            <Route path="/auth/2fa" element={<AuthTwoStepVerification />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;