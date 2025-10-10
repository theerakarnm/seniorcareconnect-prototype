# Database Schema Documentation

## Overview

This document describes the database schema for the Flower Gift Application, designed to support a custom flower arrangement platform with dual-language support (English/Thai), AI-powered previews, and comprehensive order management.

## Schema Design Principles

1. **Dual Language Support**: All user-facing content has both English (`nameNative`) and Thai (`nameTH`) versions
2. **Flexible Pricing**: Color-specific pricing for flowers with base price fallback
3. **Rich Metadata**: JSON fields for complex data structures (colors, positioning, templates)
4. **Audit Trail**: Created/updated timestamps on all tables
5. **Soft Deletes**: `isActive` flags instead of hard deletes for business data
6. **Extensibility**: System settings table for configurable business rules

## Core Tables

### Flower Management

#### `flower_categories`
Organizes flowers into logical groups (roses, lilies, tulips, etc.)

```sql
- id: text (primary key) - Unique category identifier
- name_native: text - English category name
- name_th: text - Thai category name  
- description_native: text - English description
- description_th: text - Thai description
- sort_order: integer - Display ordering
- is_active: boolean - Soft delete flag
- created_at/updated_at: timestamp - Audit trail
```

#### `flowers`
Individual flower types with pricing and color options

```sql
- id: text (primary key) - Unique flower identifier
- name_native: text - English flower name
- name_th: text - Thai flower name
- category_id: text (FK) - References flower_categories.id
- image: text - Main flower image URL
- preview_image: text - Thumbnail/preview image URL
- base_price: decimal(10,2) - Base price in THB
- description_native: text - English description
- description_th: text - Thai description
- available_colors: jsonb - Array of hex color codes
- color_prices: jsonb - Object mapping colors to prices
- is_active: boolean - Availability flag
- sort_order: integer - Display ordering
- created_at/updated_at: timestamp - Audit trail
```

**Example color_prices JSON:**
```json
{
  "#DC2626": 25,
  "#F87171": 22,
  "#FCA5A5": 20,
  "#FECACA": 18
}
```

### Arrangement Configuration

#### `arrangement_sizes`
Defines size categories with flower count limits

```sql
- id: text (primary key) - Size identifier (small/medium/large)
- name_native: text - English size name
- name_th: text - Thai size name
- min_flowers: integer - Minimum flower count
- max_flowers: integer - Maximum flower count
- base_price: decimal(10,2) - Additional size-based pricing
- is_active: boolean - Availability flag
- sort_order: integer - Display ordering
- created_at/updated_at: timestamp - Audit trail
```

#### `arrangement_templates`
Pre-designed flower arrangements for quick selection

```sql
- id: text (primary key) - Template identifier
- name_native: text - English template name
- name_th: text - Thai template name
- description_native: text - English description
- description_th: text - Thai description
- preview_image: text - Template preview image
- template_data: jsonb - Flower positioning data
- is_active: boolean - Availability flag
- sort_order: integer - Display ordering
- created_at/updated_at: timestamp - Audit trail
```

**Example template_data JSON:**
```json
{
  "flowers": [
    {
      "flowerId": "rose-red",
      "x": 200,
      "y": 150,
      "scale": 1.2,
      "rotation": 0,
      "color": "#DC2626",
      "zIndex": 3
    }
  ]
}
```

### AI Preview System

#### `ai_preview_styles`
Different AI generation styles for arrangement previews

```sql
- id: text (primary key) - Style identifier
- name_native: text - English style name
- name_th: text - Thai style name
- description_native: text - English description
- description_th: text - Thai description
- style_native: text - English style details
- style_th: text - Thai style details
- preview_image: text - Style example image
- prompt_template: text - AI generation prompt template
- is_active: boolean - Availability flag
- sort_order: integer - Display ordering
- created_at/updated_at: timestamp - Audit trail
```

### Order Management

#### `orders`
Main order records with customer and delivery information

```sql
- id: uuid (primary key) - Unique order identifier
- order_number: varchar(50) - Human-readable order number
- user_id: text (FK, nullable) - References user.id (guest orders allowed)
- status: text - Order status (pending/confirmed/processing/delivered/cancelled)

-- Recipient Information
- recipient_name: text - Delivery recipient name
- recipient_phone: text - Recipient phone number
- recipient_email: text - Recipient email address

-- Delivery Address
- delivery_address: text - Street address
- delivery_city: text - City
- delivery_state: text - State/province
- delivery_zip_code: text - Postal code

-- Delivery Options
- delivery_date: timestamp - Requested delivery date
- delivery_time: text - Time preference (morning/afternoon/evening)
- special_instructions: text - Delivery notes

-- Message Card
- include_card: boolean - Whether to include message card
- card_message: text - Message content
- sender_name: text - Sender name for card

-- Additional Services
- express_delivery: boolean - Express delivery flag
- gift_wrapping: boolean - Gift wrapping flag
- care_instructions: boolean - Include care instructions

-- Pricing
- subtotal: decimal(10,2) - Flowers subtotal
- delivery_fee: decimal(10,2) - Standard delivery fee
- express_delivery_fee: decimal(10,2) - Express delivery surcharge
- gift_wrapping_fee: decimal(10,2) - Gift wrapping fee
- total: decimal(10,2) - Final total amount

-- Payment
- payment_status: text - Payment status (pending/paid/failed/refunded)
- payment_method: text - Payment method used
- payment_reference: text - Payment processor reference

-- Arrangement Details
- arrangement_size: text - Selected size (small/medium/large)
- selected_ai_style_id: text (FK) - References ai_preview_styles.id
- arrangement_data: jsonb - Complete arrangement design data

- created_at/updated_at: timestamp - Audit trail
```

**Example arrangement_data JSON:**
```json
{
  "placedFlowers": [
    {
      "id": "flower-1",
      "flowerId": "rose-red",
      "x": 200,
      "y": 150,
      "scale": 1.2,
      "rotation": 0,
      "color": "#DC2626",
      "zIndex": 3
    }
  ]
}
```

#### `order_items`
Individual flower items within an order

```sql
- id: uuid (primary key) - Unique item identifier
- order_id: uuid (FK) - References orders.id
- flower_id: text (FK) - References flowers.id
- quantity: integer - Number of this flower type
- selected_color: text - Chosen color (hex code)
- unit_price: decimal(10,2) - Price per flower
- total_price: decimal(10,2) - Total for this item

-- Position Data (for arrangement recreation)
- position_x: decimal(10,2) - X coordinate in canvas
- position_y: decimal(10,2) - Y coordinate in canvas
- scale: decimal(10,2) - Scale factor
- rotation: decimal(10,2) - Rotation in degrees
- z_index: integer - Layer ordering

- created_at/updated_at: timestamp - Audit trail
```

#### `order_ai_previews`
Generated AI preview images for orders

```sql
- id: uuid (primary key) - Unique preview identifier
- order_id: uuid (FK) - References orders.id
- ai_style_id: text (FK) - References ai_preview_styles.id
- generated_image: text - URL to generated image
- generation_prompt: text - Actual prompt used for generation
- generation_status: text - Status (pending/generating/completed/failed)
- is_selected: boolean - Whether customer selected this preview
- generated_at: timestamp - When generation completed
- created_at/updated_at: timestamp - Audit trail
```

### System Configuration

#### `system_settings`
Configurable business rules and settings

```sql
- id: text (primary key) - Setting identifier
- setting_key: text (unique) - Setting key name
- setting_value: jsonb - Setting value (flexible JSON)
- description: text - Setting description
- is_active: boolean - Whether setting is active
- created_at/updated_at: timestamp - Audit trail
```

**Example system settings:**
```json
// Delivery fees
{
  "standard": 12,
  "express": 15,
  "freeDeliveryThreshold": 100
}

// Business hours
{
  "monday": { "open": "09:00", "close": "18:00", "closed": false },
  "tuesday": { "open": "09:00", "close": "18:00", "closed": false }
}
```

## Relationships

```
flower_categories (1) -> (many) flowers
flowers (1) -> (many) order_items
arrangement_sizes (1) -> (many) orders
ai_preview_styles (1) -> (many) orders
ai_preview_styles (1) -> (many) order_ai_previews
orders (1) -> (many) order_items
orders (1) -> (many) order_ai_previews
user (1) -> (many) orders [optional]
```

## Indexes

Recommended indexes for performance:

```sql
-- Flowers
CREATE INDEX idx_flowers_category ON flowers(category_id);
CREATE INDEX idx_flowers_active ON flowers(is_active);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);

-- Order Items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_flower ON order_items(flower_id);

-- AI Previews
CREATE INDEX idx_ai_previews_order ON order_ai_previews(order_id);
CREATE INDEX idx_ai_previews_status ON order_ai_previews(generation_status);
```

## Data Migration Strategy

1. **Phase 1**: Create core tables (categories, flowers, sizes)
2. **Phase 2**: Add templates and AI styles
3. **Phase 3**: Create order management tables
4. **Phase 4**: Add system settings and configuration

## Backup and Maintenance

- **Daily backups** of all order and customer data
- **Weekly full backups** including images and generated content
- **Monthly cleanup** of failed AI generations and temporary data
- **Quarterly review** of inactive flowers and categories

## Security Considerations

- **PII Protection**: Customer data encrypted at rest
- **Payment Data**: No sensitive payment info stored (use payment processor tokens)
- **Image Storage**: Secure cloud storage with signed URLs
- **Access Control**: Role-based permissions for admin functions