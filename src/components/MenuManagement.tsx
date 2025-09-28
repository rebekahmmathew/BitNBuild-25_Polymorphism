import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  Clock,
  AlertTriangle,
  Zap,
  Leaf,
  Heart,
  TrendingUp,
  ChefHat,
  Utensils
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  dietType: 'veg' | 'non-veg' | 'jain' | 'vegan';
  spiceLevel: 'mild' | 'medium' | 'spicy';
  allergens: string[];
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  price: number;
  preparationTime: number;
  ingredients: string[];
  isAvailable: boolean;
}

interface DayMenu {
  date: string;
  lunch: MenuItem[];
  dinner: MenuItem[];
}

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [weeklyMenu, setWeeklyMenu] = useState<DayMenu[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<'lunch' | 'dinner'>('lunch');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [allergyAlerts, setAllergyAlerts] = useState<string[]>([]);

  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    category: 'main',
    dietType: 'veg',
    spiceLevel: 'mild',
    allergens: [],
    nutritionInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },
    price: 0,
    preparationTime: 30,
    ingredients: [],
    isAvailable: true
  });

  useEffect(() => {
    // Initialize weekly menu for the current week
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    
    const weekMenu: DayMenu[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      weekMenu.push({
        date: date.toISOString().split('T')[0],
        lunch: generateSampleMenu('lunch'),
        dinner: generateSampleMenu('dinner')
      });
    }
    
    setWeeklyMenu(weekMenu);
    setSelectedDate(weekMenu[0].date);
  }, []);

  const generateSampleMenu = (mealType: 'lunch' | 'dinner'): MenuItem[] => {
    const sampleItems: MenuItem[] = [
      {
        id: `item-${Math.random()}`,
        name: 'Dal Tadka',
        description: 'Yellow lentils tempered with cumin and garlic',
        category: 'main',
        dietType: 'veg',
        spiceLevel: 'mild',
        allergens: [],
        nutritionInfo: { calories: 180, protein: 12, carbs: 28, fat: 4, fiber: 8 },
        price: 80,
        preparationTime: 25,
        ingredients: ['Yellow Lentils', 'Cumin', 'Garlic', 'Turmeric', 'Ginger'],
        isAvailable: true
      },
      {
        id: `item-${Math.random()}`,
        name: 'Jeera Rice',
        description: 'Fragrant basmati rice with cumin seeds',
        category: 'main',
        dietType: 'veg',
        spiceLevel: 'mild',
        allergens: [],
        nutritionInfo: { calories: 220, protein: 4, carbs: 45, fat: 3, fiber: 2 },
        price: 60,
        preparationTime: 20,
        ingredients: ['Basmati Rice', 'Cumin Seeds', 'Bay Leaves', 'Ghee'],
        isAvailable: true
      },
      {
        id: `item-${Math.random()}`,
        name: 'Mixed Vegetable Curry',
        description: 'Seasonal vegetables in aromatic spices',
        category: 'main',
        dietType: 'veg',
        spiceLevel: 'medium',
        allergens: [],
        nutritionInfo: { calories: 150, protein: 6, carbs: 20, fat: 5, fiber: 6 },
        price: 90,
        preparationTime: 30,
        ingredients: ['Mixed Vegetables', 'Onions', 'Tomatoes', 'Spices'],
        isAvailable: true
      }
    ];

    if (mealType === 'dinner') {
      sampleItems.push({
        id: `item-${Math.random()}`,
        name: 'Chapati',
        description: 'Fresh whole wheat flatbread',
        category: 'main',
        dietType: 'veg',
        spiceLevel: 'mild',
        allergens: ['Gluten'],
        nutritionInfo: { calories: 70, protein: 3, carbs: 15, fat: 1, fiber: 2 },
        price: 15,
        preparationTime: 10,
        ingredients: ['Whole Wheat Flour', 'Water', 'Salt'],
        isAvailable: true
      });
    }

    return sampleItems;
  };

  const checkAllergyConflicts = (items: MenuItem[]) => {
    const commonAllergens = ['Peanuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish'];
    const presentAllergens = new Set<string>();
    
    items.forEach(item => {
      item.allergens.forEach(allergen => {
        if (commonAllergens.includes(allergen)) {
          presentAllergens.add(allergen);
        }
      });
    });

    setAllergyAlerts(Array.from(presentAllergens));
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const menuItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newMenuItem.name!,
      description: newMenuItem.description!,
      category: newMenuItem.category!,
      dietType: newMenuItem.dietType!,
      spiceLevel: newMenuItem.spiceLevel!,
      allergens: newMenuItem.allergens!,
      nutritionInfo: newMenuItem.nutritionInfo!,
      price: newMenuItem.price!,
      preparationTime: newMenuItem.preparationTime!,
      ingredients: newMenuItem.ingredients!,
      isAvailable: newMenuItem.isAvailable!
    };

    const updatedMenu = weeklyMenu.map(day => {
      if (day.date === selectedDate) {
        const updatedDay = { ...day };
        updatedDay[selectedMeal] = [...updatedDay[selectedMeal], menuItem];
        checkAllergyConflicts(updatedDay[selectedMeal]);
        return updatedDay;
      }
      return day;
    });

    setWeeklyMenu(updatedMenu);
    setIsAddingItem(false);
    resetNewMenuItem();
    toast.success('Menu item added successfully!');
  };

  const resetNewMenuItem = () => {
    setNewMenuItem({
      name: '',
      description: '',
      category: 'main',
      dietType: 'veg',
      spiceLevel: 'mild',
      allergens: [],
      nutritionInfo: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      },
      price: 0,
      preparationTime: 30,
      ingredients: [],
      isAvailable: true
    });
  };

  const getDietBadgeColor = (dietType: string) => {
    switch (dietType) {
      case 'veg': return 'bg-green-100 text-green-800';
      case 'non-veg': return 'bg-red-100 text-red-800';
      case 'jain': return 'bg-orange-100 text-orange-800';
      case 'vegan': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpiceBadgeColor = (spiceLevel: string) => {
    switch (spiceLevel) {
      case 'mild': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'spicy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedDayMenu = weeklyMenu.find(day => day.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-gray-600">Manage your daily menus with AI-powered allergy detection</p>
        </div>
        <Button 
          onClick={() => setIsAddingItem(true)}
          className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Weekly Calendar
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Nutrition Analysis
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Week Navigation */}
          <div className="grid grid-cols-7 gap-2">
            {weeklyMenu.map((day) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en', { weekday: 'short' });
              const dayNumber = date.getDate();
              
              return (
                <Button
                  key={day.date}
                  variant={selectedDate === day.date ? 'default' : 'outline'}
                  className="h-16 flex-col"
                  onClick={() => setSelectedDate(day.date)}
                >
                  <span className="text-xs">{dayName}</span>
                  <span className="text-lg font-bold">{dayNumber}</span>
                </Button>
              );
            })}
          </div>

          {/* Allergy Alerts */}
          {allergyAlerts.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Allergy Alert</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-2">
                  The following allergens are present in today's menu:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allergyAlerts.map(allergen => (
                    <Badge key={allergen} variant="destructive">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meal Type Selector */}
          <div className="flex gap-2">
            <Button
              variant={selectedMeal === 'lunch' ? 'default' : 'outline'}
              onClick={() => setSelectedMeal('lunch')}
              className="flex items-center gap-2"
            >
              <Utensils className="h-4 w-4" />
              Lunch Menu
            </Button>
            <Button
              variant={selectedMeal === 'dinner' ? 'default' : 'outline'}
              onClick={() => setSelectedMeal('dinner')}
              className="flex items-center gap-2"
            >
              <ChefHat className="h-4 w-4" />
              Dinner Menu
            </Button>
          </div>

          {/* Menu Items */}
          <div className="grid gap-4">
            {selectedDayMenu && selectedDayMenu[selectedMeal].map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge className={getDietBadgeColor(item.dietType)}>
                          {item.dietType}
                        </Badge>
                        <Badge className={getSpiceBadgeColor(item.spiceLevel)}>
                          {item.spiceLevel}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {item.preparationTime}min
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      
                      {/* Nutrition Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <span>{item.nutritionInfo.calories} cal</span>
                        <span>{item.nutritionInfo.protein}g protein</span>
                        <span>{item.nutritionInfo.carbs}g carbs</span>
                        <span>{item.nutritionInfo.fat}g fat</span>
                      </div>

                      {/* Allergens */}
                      {item.allergens.length > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          <div className="flex flex-wrap gap-1">
                            {item.allergens.map(allergen => (
                              <Badge key={allergen} variant="outline" className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">₹{item.price}</span>
                        <Badge variant={item.isAvailable ? 'default' : 'destructive'}>
                          {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Nutritional Analysis
              </CardTitle>
              <CardDescription>
                Daily nutritional breakdown and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDayMenu && (
                <div className="space-y-6">
                  {/* Lunch Nutrition */}
                  <div>
                    <h3 className="font-semibold mb-3">Lunch Menu Nutrition</h3>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedDayMenu.lunch.reduce((sum, item) => sum + item.nutritionInfo.calories, 0)}
                        </div>
                        <div className="text-sm text-gray-500">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedDayMenu.lunch.reduce((sum, item) => sum + item.nutritionInfo.protein, 0)}g
                        </div>
                        <div className="text-sm text-gray-500">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedDayMenu.lunch.reduce((sum, item) => sum + item.nutritionInfo.carbs, 0)}g
                        </div>
                        <div className="text-sm text-gray-500">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedDayMenu.lunch.reduce((sum, item) => sum + item.nutritionInfo.fat, 0)}g
                        </div>
                        <div className="text-sm text-gray-500">Fat</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {selectedDayMenu.lunch.reduce((sum, item) => sum + item.nutritionInfo.fiber, 0)}g
                        </div>
                        <div className="text-sm text-gray-500">Fiber</div>
                      </div>
                    </div>
                  </div>

                  {/* Dinner Nutrition */}
                  <div>
                    <h3 className="font-semibold mb-3">Dinner Menu Nutrition</h3>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedDayMenu.dinner.reduce((sum, item) => sum + item.nutritionInfo.calories, 0)}
                        </div>
                        <div className="text-sm text-gray-500">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedDayMenu.dinner.reduce((sum, item) => sum + item.nutritionInfo.protein, 0)}g
                        </div>
                        <div className="text-sm text-gray-500">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedDayMenu.dinner.reduce((sum, item) => sum + item.nutritionInfo.carbs, 0)}g
                        </div>
                        <div className="text-sm text-gray-500">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedDayMenu.dinner.reduce((sum, item) => sum + item.nutritionInfo.fat, 0)}g
                        </div>
                        <div className="text-sm text-gray-500">Fat</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {selectedDayMenu.dinner.reduce((sum, item) => sum + item.nutritionInfo.fiber, 0)}g
                        </div>
                        <div className="text-sm text-gray-500">Fiber</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  AI Menu Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Suggested Addition</h4>
                    <p className="text-sm text-blue-700">
                      Consider adding a high-fiber salad to balance the carb-heavy lunch menu. 
                      This would improve the nutritional profile for health-conscious customers.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Popular Combination</h4>
                    <p className="text-sm text-green-700">
                      Dal Tadka + Jeera Rice is your most popular combination this month. 
                      Consider featuring it as a combo meal for better margins.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Allergy Alert</h4>
                    <p className="text-sm text-yellow-700">
                      You have 3 customers with gluten allergies. Consider adding gluten-free 
                      alternatives like millet rotis or rice-based breads.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Menu Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Most Popular Item</span>
                    <span className="text-green-600 font-semibold">Dal Tadka (94% orders)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Least Popular Item</span>
                    <span className="text-red-600 font-semibold">Mixed Veg Curry (23% orders)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Average Rating</span>
                    <span className="text-blue-600 font-semibold">4.7/5.0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Profit Margin</span>
                    <span className="text-purple-600 font-semibold">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Menu Item Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Menu Item</CardTitle>
              <CardDescription>Create a new dish for your menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-name">Dish Name</Label>
                  <Input
                    id="item-name"
                    value={newMenuItem.name}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Butter Chicken"
                  />
                </div>
                <div>
                  <Label htmlFor="item-price">Price (₹)</Label>
                  <Input
                    id="item-price"
                    type="number"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="120"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Rich and creamy chicken curry..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="diet-type">Diet Type</Label>
                  <select
                    id="diet-type"
                    value={newMenuItem.dietType}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, dietType: e.target.value as any }))}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="jain">Jain</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="spice-level">Spice Level</Label>
                  <select
                    id="spice-level"
                    value={newMenuItem.spiceLevel}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, spiceLevel: e.target.value as any }))}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="spicy">Spicy</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="prep-time">Prep Time (min)</Label>
                  <Input
                    id="prep-time"
                    type="number"
                    value={newMenuItem.preparationTime}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, preparationTime: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Nutrition Info */}
              <div>
                <Label>Nutrition Information</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  <div>
                    <Label htmlFor="calories" className="text-xs">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newMenuItem.nutritionInfo?.calories}
                      onChange={(e) => setNewMenuItem(prev => ({
                        ...prev,
                        nutritionInfo: { ...prev.nutritionInfo!, calories: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={newMenuItem.nutritionInfo?.protein}
                      onChange={(e) => setNewMenuItem(prev => ({
                        ...prev,
                        nutritionInfo: { ...prev.nutritionInfo!, protein: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={newMenuItem.nutritionInfo?.carbs}
                      onChange={(e) => setNewMenuItem(prev => ({
                        ...prev,
                        nutritionInfo: { ...prev.nutritionInfo!, carbs: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat" className="text-xs">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={newMenuItem.nutritionInfo?.fat}
                      onChange={(e) => setNewMenuItem(prev => ({
                        ...prev,
                        nutritionInfo: { ...prev.nutritionInfo!, fat: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fiber" className="text-xs">Fiber (g)</Label>
                    <Input
                      id="fiber"
                      type="number"
                      value={newMenuItem.nutritionInfo?.fiber}
                      onChange={(e) => setNewMenuItem(prev => ({
                        ...prev,
                        nutritionInfo: { ...prev.nutritionInfo!, fiber: Number(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddMenuItem} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Add to Menu
                </Button>
                <Button variant="outline" onClick={() => setIsAddingItem(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}