const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    required: true
  },
  isDirectory: {
    type: Boolean,
    default: false
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  rootDirectory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'editor'
    }
  }],
  settings: {
    defaultLanguage: {
      type: String,
      default: 'javascript'
    },
    indentation: {
      type: String,
      enum: ['2spaces', '4spaces', 'tabs'],
      default: '2spaces'
    },
    lineEnding: {
      type: String,
      enum: ['lf', 'crlf'],
      default: 'lf'
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
projectSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for number of files in project
projectSchema.virtual('fileCount').get(function() {
  return this.files ? this.files.length : 0;
});

// Method to check if user has permission on project
projectSchema.methods.hasPermission = function(userId, requiredRole = 'viewer') {
  // Owner has all permissions
  if (this.owner.equals(userId)) return true;
  
  const roles = {
    viewer: 0,
    editor: 1,
    admin: 2
  };
  
  const userRole = this.collaborators.find(c => c.user.equals(userId));
  
  if (!userRole) return false;
  
  return roles[userRole.role] >= roles[requiredRole];
};

// Pre-remove hook to clean up files
projectSchema.pre('remove', async function(next) {
  try {
    // Remove all files associated with this project
    await this.model('File').deleteMany({ _id: { $in: this.files } });
    next();
  } catch (error) {
    next(error);
  }
});

const Project = mongoose.model('Project', projectSchema);
const File = mongoose.model('File', fileSchema);

module.exports = { Project, File };
