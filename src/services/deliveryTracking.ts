export interface DeliveryUpdate {
  id: string;
  deliveryStaffId: string;
  location: { lat: number; lng: number };
  timestamp: Date;
  status: 'picked_up' | 'in_transit' | 'delivered' | 'delayed';
  eta: Date;
  speed: number; // km/h
  heading: number; // degrees
}

export interface DeliveryStaff {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  currentLocation: { lat: number; lng: number };
  status: 'available' | 'busy' | 'offline';
  currentDelivery?: string;
  lastUpdate: Date;
}

export class DeliveryTrackingService {
  private deliveryStaff: DeliveryStaff[] = [];
  private deliveryUpdates: Map<string, DeliveryUpdate[]> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeDeliveryStaff();
    this.startRealTimeUpdates();
  }

  private initializeDeliveryStaff() {
    // Mumbai-based delivery staff
    this.deliveryStaff = [
      {
        id: 'staff-001',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        vehicle: 'Bike - Honda Activa',
        currentLocation: { lat: 19.0760, lng: 72.8777 }, // Mumbai Central
        status: 'busy',
        currentDelivery: 'delivery-001',
        lastUpdate: new Date()
      },
      {
        id: 'staff-002',
        name: 'Priya Sharma',
        phone: '+91 98765 43211',
        vehicle: 'Bike - Bajaj Pulsar',
        currentLocation: { lat: 19.0176, lng: 72.8562 }, // Andheri
        status: 'available',
        lastUpdate: new Date()
      },
      {
        id: 'staff-003',
        name: 'Amit Patel',
        phone: '+91 98765 43212',
        vehicle: 'Bike - TVS Jupiter',
        currentLocation: { lat: 19.2183, lng: 72.9781 }, // Thane
        status: 'busy',
        currentDelivery: 'delivery-002',
        lastUpdate: new Date()
      }
    ];
  }

  private startRealTimeUpdates() {
    this.updateInterval = setInterval(() => {
      this.simulateLocationUpdates();
    }, 10000); // Update every 10 seconds
  }

  private simulateLocationUpdates() {
    this.deliveryStaff.forEach(staff => {
      if (staff.status === 'busy' && staff.currentDelivery) {
        // Simulate movement towards delivery location
        const currentUpdate = this.getLatestUpdate(staff.currentDelivery);
        if (currentUpdate) {
          // Move slightly towards destination (simplified)
          const movementFactor = 0.0001; // Small movement per update
          staff.currentLocation.lat += (Math.random() - 0.5) * movementFactor;
          staff.currentLocation.lng += (Math.random() - 0.5) * movementFactor;
          staff.lastUpdate = new Date();

          // Create new delivery update
          const update: DeliveryUpdate = {
            id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            deliveryStaffId: staff.id,
            location: { ...staff.currentLocation },
            timestamp: new Date(),
            status: 'in_transit',
            eta: this.calculateETA(staff.currentLocation, currentUpdate.location),
            speed: 25 + Math.random() * 10, // 25-35 km/h
            heading: Math.random() * 360
          };

          this.addDeliveryUpdate(staff.currentDelivery, update);
        }
      }
    });
  }

  private calculateETA(
    currentLocation: { lat: number; lng: number },
    targetLocation: { lat: number; lng: number }
  ): Date {
    const distance = this.getDistance(currentLocation, targetLocation);
    const averageSpeed = 25; // km/h
    const travelTimeMinutes = (distance / averageSpeed) * 60;
    
    return new Date(Date.now() + travelTimeMinutes * 60000);
  }

  private getDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(coord2.lat - coord1.lat);
    const dLon = this.deg2rad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.lat)) *
        Math.cos(this.deg2rad(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  addDeliveryUpdate(deliveryId: string, update: DeliveryUpdate) {
    if (!this.deliveryUpdates.has(deliveryId)) {
      this.deliveryUpdates.set(deliveryId, []);
    }
    this.deliveryUpdates.get(deliveryId)!.push(update);
  }

  getLatestUpdate(deliveryId: string): DeliveryUpdate | null {
    const updates = this.deliveryUpdates.get(deliveryId);
    if (!updates || updates.length === 0) return null;
    
    return updates[updates.length - 1];
  }

  getDeliveryHistory(deliveryId: string): DeliveryUpdate[] {
    return this.deliveryUpdates.get(deliveryId) || [];
  }

  getAllDeliveryStaff(): DeliveryStaff[] {
    return [...this.deliveryStaff];
  }

  getDeliveryStaffById(id: string): DeliveryStaff | null {
    return this.deliveryStaff.find(staff => staff.id === id) || null;
  }

  updateDeliveryStaffStatus(id: string, status: DeliveryStaff['status']) {
    const staff = this.deliveryStaff.find(s => s.id === id);
    if (staff) {
      staff.status = status;
      staff.lastUpdate = new Date();
    }
  }

  assignDelivery(staffId: string, deliveryId: string) {
    const staff = this.deliveryStaff.find(s => s.id === staffId);
    if (staff) {
      staff.currentDelivery = deliveryId;
      staff.status = 'busy';
      staff.lastUpdate = new Date();
    }
  }

  completeDelivery(staffId: string) {
    const staff = this.deliveryStaff.find(s => s.id === staffId);
    if (staff) {
      staff.currentDelivery = undefined;
      staff.status = 'available';
      staff.lastUpdate = new Date();
    }
  }

  // Get real-time location for a specific delivery
  getCurrentLocation(deliveryId: string): { lat: number; lng: number } | null {
    const latestUpdate = this.getLatestUpdate(deliveryId);
    return latestUpdate ? latestUpdate.location : null;
  }

  // Get ETA for a specific delivery
  getETA(deliveryId: string): Date | null {
    const latestUpdate = this.getLatestUpdate(deliveryId);
    return latestUpdate ? latestUpdate.eta : null;
  }

  // Get delivery status
  getDeliveryStatus(deliveryId: string): string | null {
    const latestUpdate = this.getLatestUpdate(deliveryId);
    return latestUpdate ? latestUpdate.status : null;
  }

  // Cleanup
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const deliveryTrackingService = new DeliveryTrackingService();
