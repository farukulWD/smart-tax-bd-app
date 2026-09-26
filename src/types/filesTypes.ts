export interface IFile {
  _id: string;
  name: string;
  type: string;
  userId: string;
  orderId: string;
  file: string;
  createdAt: string;
  updatedAt: string;
}

// Documents issued by the admin (Acknowledgement, Tax Certificate, ...).
// Served by /files/get-user-tax-documents with the order populated.
export interface ITaxDocument extends Omit<IFile, 'orderId'> {
  orderId: { _id: string; tax_year: string; status: string } | null;
}
