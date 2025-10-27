# Translation Testing Guide

## 🎯 Purpose
This guide provides systematic steps to test the translation label migration across all modules (Customer, Dashboard, Roles, Carriers).

## ✅ Pre-requisites (Already Verified)

- [x] Translation service running on port 3007
- [x] French translations seeded in database
- [x] Spanish translations seeded in database
- [x] No TypeScript compilation errors
- [x] All label files and hooks in place

## 🧪 Testing Checklist

### 1. Start the Application

```bash
# From react-admin directory
npm start
```

**Expected**: Application opens at http://localhost:3000

**Login Credentials**:
- Email: `admin@example.com`
- Password: `Admin123!`

---

### 2. Verify Language Selector

**Location**: Top-right corner of the application

**Expected Elements**:
- 🇬🇧 English (EN)
- 🇫🇷 French (FR)
- 🇪🇸 Spanish (ES)

**Test**:
1. Click on language selector
2. Verify all three languages are available
3. Current language should be highlighted

---

### 3. Test Customer Module

#### Navigate
- URL: `/customers`
- Menu: Click "Customers" in sidebar

#### Test Scenarios

| Action | English | French | Spanish |
|--------|---------|--------|---------|
| **Page Title** | Customers | Clients | Clientes |
| **Subtitle** | Manage your customer database | Gérez votre base de données clients | Administre su base de datos de clientes |
| **Add Button** | Add Customer | Ajouter un client | Agregar cliente |
| **Edit Button** | Edit | Modifier | Editar |
| **Delete Button** | Delete | Supprimer | Eliminar |
| **Search Placeholder** | Search customers by name, email, or company... | Rechercher des clients par nom, e-mail ou entreprise... | Buscar clientes por nombre, correo o empresa... |

#### Table Headers
- First Name → Prénom → Nombre
- Last Name → Nom de famille → Apellido
- Email → E-mail → Correo electrónico
- Status → Statut → Estado

#### Test CRUD in Each Language

**CREATE**:
1. Switch to French
2. Click "Ajouter un client"
3. Fill form (labels should be in French)
4. Submit
5. Success message should be: "Client créé avec succès"

**UPDATE**:
1. Switch to Spanish
2. Click "Editar" on a customer
3. Form labels should be in Spanish
4. Submit
5. Success message: "Cliente actualizado exitosamente"

**DELETE**:
1. Click "Eliminar" on a test customer
2. Confirmation dialog: "¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer."
3. Confirm
4. Success message: "Cliente eliminado exitosamente"

---

### 4. Test Dashboard Module

#### Navigate
- URL: `/dashboard`
- Menu: Click "Dashboard" in sidebar

#### Test Scenarios

| Element | English | French | Spanish |
|---------|---------|--------|---------|
| **Page Title** | Dashboard | Tableau de bord | Panel de control |
| **Welcome** | Welcome back | Bon retour | Bienvenido de nuevo |
| **Total Users** | Total Users | Total des utilisateurs | Total de usuarios |
| **Total Customers** | Total Customers | Total des clients | Total de clientes |
| **Total Carriers** | Total Carriers | Total des transporteurs | Total de transportistas |

#### Cards Test
1. Switch to French
2. Verify all 5 cards have French titles:
   - "Utilisateurs" (Users)
   - "Clients" (Customers)
   - "Transporteurs" (Carriers)
   - "Analytique" (Analytics)
   - "Paramètres" (Settings)

3. Switch to Spanish
4. Verify Spanish titles:
   - "Usuarios"
   - "Clientes"
   - "Transportistas"
   - "Análisis"
   - "Configuración"

#### Charts/Stats
- Sales Trend → Tendance des ventes → Tendencia de ventas
- Orders Trend → Tendance des commandes → Tendencia de pedidos
- Revenue by Category → Revenu par catégorie → Ingresos por categoría

---

### 5. Test Roles Module

#### Navigate
- URL: `/roles`
- Menu: Click "Roles" in sidebar

#### Test Scenarios

| Action | English | French | Spanish |
|--------|---------|--------|---------|
| **Page Title** | Roles & Permissions | Rôles et permissions | Roles y permisos |
| **Subtitle** | Manage user roles and access permissions | Gérer les rôles utilisateurs et les permissions d'accès | Administrar roles de usuario y permisos de acceso |
| **Create Button** | Create Role | Créer un rôle | Crear rol |
| **Save Button** | Save Role | Enregistrer le rôle | Guardar rol |

#### Permission Categories (French)
- User Management → Gestion des utilisateurs
- Role Management → Gestion des rôles
- System Administration → Administration système
- Content Management → Gestion de contenu
- Analytics & Reports → Analytique et rapports

#### Permission Categories (Spanish)
- User Management → Gestión de usuarios
- Role Management → Gestión de roles
- System Administration → Administración del sistema
- Content Management → Gestión de contenido
- Analytics & Reports → Análisis e informes

#### Permission Actions
Test the permission action labels:
- View → Voir → Ver
- Create → Créer → Crear
- Update → Mettre à jour → Actualizar
- Delete → Supprimer → Eliminar
- Full Management → Gestion complète → Gestión completa

#### Test Role CRUD

**CREATE**:
1. Switch to French
2. Click "Créer un rôle"
3. Enter role name (e.g., "Test Role")
4. Select permissions (labels should be in French)
5. Submit
6. Success: "Rôle créé avec succès"

**VALIDATION**:
1. Try to create role without name
2. Error should be in current language:
   - FR: "Le nom du rôle est requis"
   - ES: "El nombre del rol es obligatorio"

---

### 6. Test Carriers Module

#### Navigate
- URL: `/carriers`
- Menu: Click "Carriers" in sidebar

#### Test Scenarios

| Action | English | French | Spanish |
|--------|---------|--------|---------|
| **Page Title** | Carriers | Transporteurs | Transportistas |
| **Subtitle** | Manage your carrier partners | Gérez vos partenaires transporteurs | Administre sus socios transportistas |
| **Add Button** | Add Carrier | Ajouter un transporteur | Agregar transportista |
| **Export Button** | Export CSV | Exporter CSV | Exportar CSV |

#### Table Headers
- Name → Nom → Nombre
- Email → E-mail → Correo electrónico
- Phone → Téléphone → Teléfono
- Code → Code → Código
- Status → Statut → Estado

#### Form Labels (French)
- Name → Nom
- Contact Email → E-mail de contact
- Contact Phone → Téléphone de contact
- Code → Code
- Description → Description

#### Placeholders (Spanish)
- Enter carrier name → Ingrese el nombre del transportista
- Enter carrier code → Ingrese el código del transportista
- Enter contact email → Ingrese el correo de contacto

#### Test Carrier CRUD

**CREATE**:
1. Switch to French
2. Click "Ajouter un transporteur"
3. Fill form with French labels
4. Submit
5. Success: "Transporteur créé avec succès"

**VALIDATION**:
1. Try to submit without required fields
2. Errors should be in current language:
   - FR: "Le nom est requis"
   - ES: "El nombre es obligatorio"

---

## 🔍 Browser DevTools Checklist

### Console Tab
- [ ] No errors related to translations
- [ ] No React Query errors
- [ ] No "Cannot read property" errors

### Network Tab
1. Filter by "translation"
2. Look for calls to `/api/v1/translation/batch`
3. Verify responses contain translated text
4. Check response status: 200 OK

### Application Tab
1. Go to "Local Storage"
2. Check for language preference key
3. Should persist after page reload

---

## 🎯 Key Success Indicators

### ✅ Everything Works If:

1. **Language Switcher**
   - All three languages available
   - Switching is instant (no page reload)
   - Selection persists across pages

2. **Page Titles & Headers**
   - Translate immediately when language changes
   - No English text remains visible

3. **Buttons & Actions**
   - All buttons translate
   - Tooltips translate (if any)
   - Menu items translate

4. **Forms**
   - Field labels translate
   - Placeholders translate
   - Validation messages translate

5. **Tables**
   - Column headers translate
   - Empty state messages translate
   - Pagination text translates

6. **Toast Messages**
   - Success messages translate
   - Error messages translate
   - Info messages translate

7. **Status Labels**
   - "Active/Inactive" translates correctly
   - Custom statuses translate

---

## ❌ Troubleshooting Common Issues

### Issue: Labels Not Translating

**Possible Causes**:
1. Label text doesn't match seeded translation exactly
2. React Query cache issue
3. Translation API not responding

**Solutions**:
```bash
# 1. Check exact label text in label file
grep -r "Label Text" src/features/*/labels/

# 2. Clear browser cache and localStorage
# In DevTools Console:
localStorage.clear()
location.reload()

# 3. Verify translation exists in database
curl 'http://localhost:3007/api/v1/translation/translations?original=Label%20Text'
```

### Issue: Some Labels Translate, Others Don't

**Cause**: Typo in label file or seeding script

**Solution**:
1. Find the untranslated label text
2. Search in seeding script: `grep "Label Text" scripts/seed-*-translations.ts`
3. Compare with label file
4. If missing, re-run seeding script

### Issue: Language Doesn't Persist

**Cause**: localStorage not working

**Solution**:
1. Check browser privacy settings
2. Ensure localStorage is enabled
3. Check LanguageProvider implementation

---

## 📊 Testing Report Template

Use this template to document your testing:

```markdown
## Translation Testing Report
Date: [Date]
Tester: [Name]

### Customer Module
- [ ] Page titles translate (EN/FR/ES)
- [ ] Buttons translate (EN/FR/ES)
- [ ] Form labels translate (EN/FR/ES)
- [ ] Validation messages translate (EN/FR/ES)
- [ ] Success/error toasts translate (EN/FR/ES)
- Issues found: [None/List issues]

### Dashboard Module
- [ ] Page titles translate (EN/FR/ES)
- [ ] Cards translate (EN/FR/ES)
- [ ] Stats translate (EN/FR/ES)
- [ ] Charts translate (EN/FR/ES)
- Issues found: [None/List issues]

### Roles Module
- [ ] Page titles translate (EN/FR/ES)
- [ ] Permission categories translate (EN/FR/ES)
- [ ] Permission actions translate (EN/FR/ES)
- [ ] Form labels translate (EN/FR/ES)
- [ ] Validation messages translate (EN/FR/ES)
- Issues found: [None/List issues]

### Carriers Module
- [ ] Page titles translate (EN/FR/ES)
- [ ] Buttons translate (EN/FR/ES)
- [ ] Table headers translate (EN/FR/ES)
- [ ] Form labels translate (EN/FR/ES)
- [ ] Placeholders translate (EN/FR/ES)
- Issues found: [None/List issues]

### Overall Assessment
- Language switcher: [Working/Not Working]
- Language persistence: [Working/Not Working]
- Translation API: [Working/Not Working]
- Total issues found: [Number]

### Conclusion
[Pass/Fail with notes]
```

---

## 🚀 Next Steps After Testing

1. **If All Tests Pass**:
   - Document any minor issues
   - Prepare for Git commit
   - Consider deploying to staging

2. **If Issues Found**:
   - Document each issue
   - Categorize by severity (Critical/Major/Minor)
   - Create fix plan
   - Re-test after fixes

3. **Production Readiness**:
   - Run full regression test
   - Test on different browsers
   - Test on mobile devices
   - Performance testing (translation API load)

---

## 📝 Notes

- Translation API uses React Query caching (5-minute default)
- Translations are fetched in batches for performance
- Language preference stored in localStorage
- Missing translations fall back to English
- Case-sensitive matching for label text

---

**Happy Testing! 🎉**
