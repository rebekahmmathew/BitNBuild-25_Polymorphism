import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Edit, MapPin, Star, Clock, User } from 'lucide-react'
import { staffApi } from '../store/api/staffApi'
import toast from 'react-hot-toast'

const Staff = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const queryClient = useQueryClient()

  const { data: staff, isLoading } = useQuery('staff', staffApi.getStaff)

  const createStaffMutation = useMutation(staffApi.createStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries('staff')
      setShowCreateModal(false)
      toast.success('Staff member created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create staff member')
    }
  })

  const updateStaffMutation = useMutation(staffApi.updateStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries('staff')
      toast.success('Staff member updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update staff member')
    }
  })

  const handleCreateStaff = (staffData: any) => {
    createStaffMutation.mutate(staffData)
  }

  const handleUpdateStaff = (id: string, staffData: any) => {
    updateStaffMutation.mutate({ id, ...staffData })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Staff Management</h1>
          <p className="text-secondary-600">Manage your delivery and kitchen staff</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-x-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {staff?.staff?.map((member: any) => (
          <div key={member._id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-x-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900">{member.name}</h3>
                  <p className="text-sm text-secondary-500">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => setEditingStaff(member)}
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-x-2">
                <MapPin className="h-4 w-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">
                  {member.currentLocation 
                    ? 'Location available' 
                    : 'Location not available'
                  }
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-secondary-900">
                    {member.performance?.totalDeliveries || 0}
                  </div>
                  <div className="text-xs text-secondary-500">Total Deliveries</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-secondary-900">
                    {member.performance?.onTimeDeliveries || 0}
                  </div>
                  <div className="text-xs text-secondary-500">On Time</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-secondary-600">
                    {member.performance?.rating || 0}/5
                  </span>
                </div>
                <div className="flex items-center gap-x-1">
                  <Clock className="h-4 w-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600">
                    {member.assignedDeliveries?.length || 0} assigned
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <CreateStaffModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateStaff}
          isLoading={createStaffMutation.isLoading}
        />
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <EditStaffModal
          staff={editingStaff}
          onClose={() => setEditingStaff(null)}
          onSubmit={(data) => handleUpdateStaff(editingStaff._id, data)}
          isLoading={updateStaffMutation.isLoading}
        />
      )}
    </div>
  )
}

// Create Staff Modal Component
const CreateStaffModal = ({ onClose, onSubmit, isLoading }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    role: 'delivery'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Add Staff Member</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
            >
              <option value="delivery">Delivery</option>
              <option value="kitchen">Kitchen</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="flex justify-end gap-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Creating...' : 'Create Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Staff Modal Component
const EditStaffModal = ({ staff, onClose, onSubmit, isLoading }: any) => {
  const [formData, setFormData] = useState({
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    role: staff.role,
    isActive: staff.isActive
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Edit Staff Member</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
            >
              <option value="delivery">Delivery</option>
              <option value="kitchen">Kitchen</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-secondary-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Updating...' : 'Update Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Staff
