
/**
 * User Schema Blueprint
 */
const UserSchema = {
    name: { type: 'String', required: true },
    email: { type: 'String', required: true, unique: true },
    password: { type: 'String', required: true },
    phone: { type: 'String', required: true },
    role: { type: 'String', enum: ['customer', 'admin'], default: 'customer' },
    status: { type: 'String', enum: ['Active', 'Suspended'], default: 'Active' },
    notifications: [{ type: 'NotificationSchema' }],
    createdAt: { type: 'Date', default: 'Date.now' }
};

export default UserSchema;
