import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory storage for MVP
class LocalStorage {
  private data: any = {
    users: [],
    subscriptions: [],
    menus: [],
    deliveries: [],
    staff: []
  };

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const dataPath = path.join(__dirname, '../../data.json');
      if (fs.existsSync(dataPath)) {
        const fileData = fs.readFileSync(dataPath, 'utf8');
        this.data = JSON.parse(fileData);
      }
    } catch (error) {
      console.log('No existing data file, starting fresh');
    }
  }

  private saveData() {
    try {
      const dataPath = path.join(__dirname, '../../data.json');
      fs.writeFileSync(dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Generic CRUD operations
  create(collection: string, item: any) {
    const id = uuidv4();
    const newItem = { ...item, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data[collection].push(newItem);
    this.saveData();
    return newItem;
  }

  findById(collection: string, id: string): any {
    return this.data[collection].find((item: any) => item.id === id);
  }

  findAll(collection: string, filter?: (item: any) => boolean): any[] {
    if (filter) {
      return this.data[collection].filter(filter);
    }
    return this.data[collection];
  }

  update(collection: string, id: string, updates: any): any {
    const index = this.data[collection].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      this.data[collection][index] = { 
        ...this.data[collection][index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.saveData();
      return this.data[collection][index];
    }
    return null;
  }

  delete(collection: string, id: string): any {
    const index = this.data[collection].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      const deleted = this.data[collection].splice(index, 1)[0];
      this.saveData();
      return deleted;
    }
    return null;
  }

  // Specific methods for our use cases
  findUserByEmail(email: string): any {
    return this.data.users.find((user: any) => user.email === email);
  }

  findSubscriptionsByUser(userId: string): any[] {
    return this.data.subscriptions.filter((sub: any) => sub.userId === userId);
  }

  findDeliveriesByDate(date: string): any[] {
    return this.data.deliveries.filter((delivery: any) => delivery.date === date);
  }

  findActiveDeliveries(): any[] {
    return this.data.deliveries.filter((delivery: any) => 
      ['scheduled', 'in_progress'].includes(delivery.status)
    );
  }
}

export const storage = new LocalStorage();
