// /components/index.ts
export { ContentWrapper } from "./layout/ContentWrapper";

export { Input } from "./form/Input";
export { Select } from "./form/Select";
export { DatePicker } from "./form/DatePicker";
export { ImageUpload } from "./form/ImageUpload";

export { Table } from "./data-display/Table";
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./data-display/Card";
export { Badge } from "./data-display/Badge";
export { Popover } from "./data-display/Popover";

export {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from "./feedback/Modal";
export { Toast, ToastContainer } from "./feedback/Toast";
export { Spinner } from "./feedback/Spinner";

export { LineChart } from "./charts/LineChart";
export { PieChart } from "./charts/PieChart";

export { SearchBar } from "./utility/SearchBar";
export { ExportButton } from "./utility/ExportButton";
export { ImportButton } from "./utility/ImportButton";
export { CopyToClipboard } from "./utility/CopyToClipboard";
export { MetricCard } from "./data-display/MetricCard";
export { Button } from "./form/Button";

// Helper function for className merging (you'll need to install clsx or implement this)
// /lib/utils.ts
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ===== Usage Examples =====

/*
// Example 1: Using Table Component
const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
];

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email' },
  { 
    key: 'status', 
    title: 'Status', 
    render: (value) => (
      <Badge variant={value === 'active' ? 'success' : 'secondary'}>
        {value}
      </Badge>
    )
  }
];

<Table 
  data={tableData} 
  columns={columns} 
  searchable={true}
  onRowClick={(record) => console.log('Clicked:', record)}
/>

// Example 2: Using Modal
const [isModalOpen, setIsModalOpen] = useState(false);

<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Action">
  <ModalContent>
    <p>Are you sure you want to perform this action?</p>
  </ModalContent>
  <ModalFooter>
    <button className="btn-outline" onClick={() => setIsModalOpen(false)}>
      Cancel
    </button>
    <button className="btn-primary" onClick={handleConfirm}>
      Confirm
    </button>
  </ModalFooter>
</Modal>

// Example 3: Using Form Components
<div className="space-y-4">
  <Input 
    label="Full Name" 
    placeholder="Enter your name"
    suggestions={['John Doe', 'Jane Smith']}
  />
  
  <Select 
    label="Country"
    options={[
      { value: 'id', label: 'Indonesia' },
      { value: 'us', label: 'United States' }
    ]}
    searchable={true}
  />
  
  <DatePicker 
    label="Birth Date"
    value={selectedDate}
    onValueChange={setSelectedDate}
  />
</div>

// Example 4: Using Charts
const chartData = [
  { month: 'Jan', sales: 1000, expenses: 800 },
  { month: 'Feb', sales: 1200, expenses: 900 },
  { month: 'Mar', sales: 1500, expenses: 1000 },
];

const chartLines = [
  { key: 'sales', name: 'Sales', color: 'rgb(var(--primary))' },
  { key: 'expenses', name: 'Expenses', color: 'rgb(var(--secondary))' }
];

<LineChart 
  data={chartData} 
  lines={chartLines}
  xAxisKey="month"
  height={300}
/>

// Example 5: Using Utility Components
<div className="flex gap-2">
  <SearchBar 
    placeholder="Search products..."
    onSearch={handleSearch}
    filters={[
      {
        key: 'category',
        label: 'Category',
        options: [
          { value: 'electronics', label: 'Electronics' },
          { value: 'clothing', label: 'Clothing' }
        ]
      }
    ]}
  />
  
  <ExportButton 
    data={tableData}
    filename="products"
  />
  
  <ImportButton 
    onImport={handleImport}
    onError={handleImportError}
  />
</div>
*/
