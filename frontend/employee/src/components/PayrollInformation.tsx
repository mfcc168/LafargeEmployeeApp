import { useState } from 'react';
import { PayrollInformationProps } from '@interfaces/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@context/AuthContext';
import { backendUrl } from '@configs/DotEnv';
import ErrorMessage from '@components/ErrorMessage';

/**
 * PayrollInformation Component
 * 
 * Displays and manages employee payroll information with:
 * - View and edit modes for salary components
 * - Real-time calculation of gross/net payments
 * - MPF deduction handling
 * - Role-based field visibility (e.g., commission for sales)
 * 
 * @param {PayrollInformationProps} props - Component properties
 * returns Payroll information interface
 */
const PayrollInformation = ({
    salaryData,
    grossPayment,
    netPayment,
    mpfDeductionAmount,
    year,
    month,
    userRole,
    employeeId
}: PayrollInformationProps) => {
    // Component state
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        baseSalary: salaryData.baseSalary || 0,
        bonusPayment: salaryData.bonusPayment || 0,
        yearEndBonus: salaryData.yearEndBonus || 0,
        transportationAllowance: salaryData.transportationAllowance || 0,
        commission: salaryData.commission || 0,
        mpfDeduction: salaryData.mpfDeduction || 0
    });

    // Authentication and data management
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    /**
     * Mutation for updating salary information
     */
    const { mutate: updateSalary, isPending: isUpdating } = useMutation({
        mutationFn: async (payload: {
            base_salary: number;
            bonus_payment: number;
            year_end_bonus: number;
            transportation_allowance: number;
            commission?: number;
        }) => {
            const response = await axios.patch(
                `${backendUrl}/api/profile/${employeeId}/update/`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        },
        onSuccess: () => {
            // Refresh salary data after successful update
            queryClient.invalidateQueries({ 
                queryKey: ['employee-salaries'] 
            });
            setIsEditing(false);
        },
        onError: (e: any) => {
            const message = e?.response?.data?.detail || 'An error occurred while saving.';
            setError(message);
            {error && (
                <ErrorMessage message={error} type="error" />
            )}
        }
    });

    // UI Handlers
    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleChange = (field: string, value: number) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        const payload = {
            base_salary: editData.baseSalary,
            bonus_payment: editData.bonusPayment,
            year_end_bonus: editData.yearEndBonus,
            transportation_allowance: editData.transportationAllowance,
            ...(userRole === 'SALESMAN' && { commission: editData.commission })
        };
        updateSalary(payload);
    };

    const handleCancel = () => {
        // Reset to original values
        setEditData({
            baseSalary: salaryData.baseSalary || 0,
            bonusPayment: salaryData.bonusPayment || 0,
            yearEndBonus: salaryData.yearEndBonus || 0,
            transportationAllowance: salaryData.transportationAllowance || 0,
            commission: salaryData.commission || 0,
            mpfDeduction: salaryData.mpfDeduction || 0
        });
        setError(null);
        setIsEditing(false);
    };

    /**
     * Renders a field in either editable or view mode
     * @param {string} label - Field display label
     * @param {string} field - Field key in state
     * @param {number} value - Current field value
     * @param {boolean} isEditable - Whether field can be edited
     * returns Field component
     */
    const renderEditableField = (label: string, field: string, value: number, isEditable = true) => {
        if (!isEditable && isEditing) return null;
        
        return isEditing && isEditable ? (
            <div>
                <label className="text-gray-600 block">{label}</label>
                <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={value}
                    onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
                />
            </div>
        ) : (
            <div>
                <p className="text-gray-600">{label}</p>
                <p className="font-medium">${value?.toFixed(2)}</p>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Header with edit controls */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Payroll Information</h1>
                {!isEditing ? (
                    <button 
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        aria-label="Edit payroll information"
                    >
                        Edit
                    </button>
                ) : (
                    <div className="space-x-2">
                        <button 
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 items-center justify-center min-w-[100px] disabled:bg-green-300"
                            aria-label="Save changes"
                        >
                            {isUpdating ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin h-3 w-3 mr-2 relative top-[1px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving...
                                </div>
                            ) : "Save"}
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            aria-label="Cancel editing"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            
            {/* Payroll content sections */}
            <div className="space-y-4">
                {/* Salary details section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Salary Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderEditableField("Base salary", "baseSalary", editData.baseSalary)}
                        {renderEditableField("Bonus", "bonusPayment", editData.bonusPayment)}
                        {renderEditableField("Year End Bonus", "yearEndBonus", editData.yearEndBonus)}
                        {renderEditableField("Transportation allowance", "transportationAllowance", editData.transportationAllowance)}
                        {(userRole === "SALESMAN") && (renderEditableField("Commission", "commission", editData.commission, false))}
                    </div>
                </div>

                {/* Payment summary section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-700 mb-3">Payment Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p className="text-gray-600">Gross payment:</p>
                            <p className="font-medium">${grossPayment.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600">MPF deduction:</p>
                            <p className="font-medium text-red-500">-${mpfDeductionAmount.toFixed(2)}</p>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between">
                            <p className="text-gray-600 font-semibold">Net payment:</p>
                            <p className="font-bold text-blue-600">${netPayment.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Period information */}
                <div className="text-sm text-gray-500 mt-4">
                    <p>For period: {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
            </div>
        </div>
    );
};

export default PayrollInformation;