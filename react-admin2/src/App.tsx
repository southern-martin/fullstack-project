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
import TaskList from './pages/TaskList';
import TaskKanban from './pages/TaskKanban';

// Table pages
import BasicTables from './pages/BasicTables';
import DataTables from './pages/DataTables';

// Pages section
import FAQ from './pages/FAQ';
import FileManager from './pages/FileManager';
import PricingTables from './pages/PricingTables';
import Error404 from './pages/Error404';
import Error500 from './pages/Error500';
import ComingSoon from './pages/ComingSoon';

// Support section
import SupportChat from './pages/SupportChat';
import SupportTicketList from './pages/SupportTicketList';
import SupportTicketReply from './pages/SupportTicketReply';
import SupportTickets from './pages/SupportTickets';

// Charts section
import BarChart from './pages/BarChart';
import LineChart from './pages/LineChart';
import PieChart from './pages/PieChart';

// UI Elements section
import UIAlerts from './pages/UIAlerts';
import UIButtons from './pages/UIButtons';
import UICards from './pages/UICards';
import UIAvatars from './pages/UIAvatars';
import UIBadge from './pages/UIBadge';
import UIBreadcrumb from './pages/UIBreadcrumb';

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
                    <Route path="pages/404" element={<Error404 />} />
                    <Route path="pages/500" element={<Error500 />} />
                    <Route path="pages/coming-soon" element={<ComingSoon />} />

              {/* Support Routes */}
              <Route path="support/chat" element={<SupportChat />} />
              <Route path="support/tickets" element={<SupportTickets />} />
              <Route path="support/tickets/list" element={<SupportTicketList />} />
              <Route path="support/tickets/reply" element={<SupportTicketReply />} />

              {/* Charts Routes */}
              <Route path="charts/line" element={<LineChart />} />
              <Route path="charts/bar" element={<BarChart />} />
              <Route path="charts/pie" element={<PieChart />} />

                    {/* UI Elements Routes */}
                    <Route path="ui/alerts" element={<UIAlerts />} />
                    <Route path="ui/buttons" element={<UIButtons />} />
                    <Route path="ui/cards" element={<UICards />} />
                    <Route path="ui/avatars" element={<UIAvatars />} />
                    <Route path="ui/badge" element={<UIBadge />} />
                    <Route path="ui/breadcrumb" element={<UIBreadcrumb />} />

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
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;