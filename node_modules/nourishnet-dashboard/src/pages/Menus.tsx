import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Plus, Edit, Eye, Trash2, Calendar, Clock } from 'lucide-react'
import { menusApi } from '../store/api/menusApi'
import toast from 'react-hot-toast'

const Menus = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const queryClient = useQueryClient()

  const { data: menus, isLoading } = useQuery('menus', menusApi.getMenus)

  const createMenuMutation = useMutation(menusApi.createMenu, {
    onSuccess: () => {
      queryClient.invalidateQueries('menus')
      setShowCreateModal(false)
      toast.success('Menu created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create menu')
    }
  })

  const publishMenuMutation = useMutation(menusApi.publishMenu, {
    onSuccess: () => {
      queryClient.invalidateQueries('menus')
      toast.success('Menu published successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to publish menu')
    }
  })

  const handleCreateMenu = (menuData: any) => {
    createMenuMutation.mutate(menuData)
  }

  const handlePublishMenu = (id: string) => {
    publishMenuMutation.mutate(id)
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
          <h1 className="text-2xl font-bold text-secondary-900">Menus</h1>
          <p className="text-secondary-600">Create and manage your daily menus</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-x-2"
        >
          <Plus className="h-4 w-4" />
          Create Menu
        </button>
      </div>

      {/* Menus Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menus?.menus?.map((menu: any) => (
          <div key={menu._id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-x-2">
                <Calendar className="h-4 w-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">
                  {new Date(menu.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  menu.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {menu.isPublished ? 'Published' : 'Draft'}
                </span>
                <span className="text-xs text-secondary-500 capitalize">
                  {menu.type}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h3 className="font-medium text-secondary-900">Menu Items</h3>
              <div className="space-y-1">
                {menu.items?.slice(0, 3).map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-secondary-700">{item.name}</span>
                    <span className="text-secondary-500">₹{item.price}</span>
                  </div>
                ))}
                {menu.items?.length > 3 && (
                  <div className="text-xs text-secondary-500">
                    +{menu.items.length - 3} more items
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Clock className="h-4 w-4 text-secondary-500" />
                <span className="text-xs text-secondary-500">
                  {menu.publishedAt 
                    ? `Published ${new Date(menu.publishedAt).toLocaleDateString()}`
                    : 'Not published'
                  }
                </span>
              </div>
              <div className="flex items-center gap-x-2">
                <button className="text-primary-600 hover:text-primary-900">
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setEditingMenu(menu)}
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {!menu.isPublished && (
                  <button
                    onClick={() => handlePublishMenu(menu._id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Menu Modal */}
      {showCreateModal && (
        <CreateMenuModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMenu}
          isLoading={createMenuMutation.isLoading}
        />
      )}

      {/* Edit Menu Modal */}
      {editingMenu && (
        <EditMenuModal
          menu={editingMenu}
          onClose={() => setEditingMenu(null)}
          onSubmit={(data) => {
            // Handle edit logic
            setEditingMenu(null)
          }}
        />
      )}
    </div>
  )
}

// Create Menu Modal Component
const CreateMenuModal = ({ onClose, onSubmit, isLoading }: any) => {
  const [formData, setFormData] = useState({
    date: '',
    type: 'daily',
    items: [{ name: '', description: '', price: 0, category: 'main', isVeg: true, allergens: [] }],
    fssaiLicense: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addMenuItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', description: '', price: 0, category: 'main', isVeg: true, allergens: [] }]
    })
  }

  const updateMenuItem = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setFormData({ ...formData, items: updatedItems })
  }

  const removeMenuItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: updatedItems })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Create Menu</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              FSSAI License
            </label>
            <input
              type="text"
              value={formData.fssaiLicense}
              onChange={(e) => setFormData({ ...formData, fssaiLicense: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-secondary-700">
                Menu Items
              </label>
              <button
                type="button"
                onClick={addMenuItem}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-secondary-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                      className="input-field"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateMenuItem(index, 'price', parseFloat(e.target.value))}
                      className="input-field"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                    className="input-field mb-3"
                    rows={2}
                    required
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={item.category}
                      onChange={(e) => updateMenuItem(index, 'category', e.target.value)}
                      className="input-field"
                    >
                      <option value="main">Main</option>
                      <option value="side">Side</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                    </select>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.isVeg}
                        onChange={(e) => updateMenuItem(index, 'isVeg', e.target.checked)}
                        className="mr-2"
                      />
                      Vegetarian
                    </label>
                    <button
                      type="button"
                      onClick={() => removeMenuItem(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              {isLoading ? 'Creating...' : 'Create Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Menu Modal Component (placeholder)
const EditMenuModal = ({ menu, onClose, onSubmit }: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Edit Menu</h2>
        <p className="text-secondary-600 mb-4">Edit menu functionality would be implemented here.</p>
        <div className="flex justify-end gap-x-3">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Menus
