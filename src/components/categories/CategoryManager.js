import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  FormControlLabel,
  Switch,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCategories } from '../context/CategoryContext';
import { toast } from 'react-toastify';

export default function CategoryManager({ isModal = false, open, onClose }) {
  const {
    categories,
    loading,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [localOpen, setLocalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    parentId: '',
  });

  useEffect(() => {
    if (!isModal || open) {
      getCategories();
    }
  }, [isModal, open]);

  const handleOpen = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive,
        parentId: category.parentId || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        isActive: true,
        parentId: '',
      });
    }
    if (!isModal) {
      setLocalOpen(true);
    }
  };

  const handleClose = () => {
    if (isModal) {
      onClose();
    } else {
      setLocalOpen(false);
    }
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
      parentId: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Catégorie mise à jour avec succès');
      } else {
        await createCategory(formData);
        toast.success('Catégorie créée avec succès');
      }
      handleClose();
      await getCategories();
    } catch (error) {
      toast.error('Une erreur est survenue');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(id);
        toast.success('Catégorie supprimée avec succès');
        await getCategories();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error(error);
      }
    }
  };

  const renderContent = () => (
    <>
      {!isModal && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Gestion des catégories</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            Nouvelle catégorie
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={category.name}
                secondary={category.description}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpen(category)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(category.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={isModal ? open : localOpen} onClose={handleClose}>
        <DialogTitle>
          {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            {!isModal && (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                    />
                  }
                  label="Actif"
                  sx={{ mt: 2 }}
                />
                <TextField
                  select
                  fullWidth
                  label="Catégorie parente"
                  value={formData.parentId}
                  onChange={(e) =>
                    setFormData({ ...formData, parentId: e.target.value })
                  }
                  margin="normal"
                >
                  <MenuItem value="">Aucune</MenuItem>
                  {categories
                    .filter((cat) => cat.id !== editingCategory?.id)
                    .map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </TextField>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingCategory ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );

  return isModal ? (
    renderContent()
  ) : (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      {renderContent()}
    </Box>
  );
}
