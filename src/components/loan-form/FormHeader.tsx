interface FormHeaderProps {
  logoUrl: string;
}

export const FormHeader = ({ logoUrl }: FormHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <img src={logoUrl} alt="YES Finance Ltd Logo" className="h-16" />
      <div>
        <h1 className="text-2xl font-bold text-primary">YES Finance Ltd</h1>
        <p className="text-sm text-gray-600">Personal Loan Application Form</p>
      </div>
    </div>
  );
};