# Guide d'Intégration du Backend avec Angular

Ce guide fournit une documentation complète pour intégrer votre API backend TypeScript/Express avec une application frontend Angular. L'API utilise JWT pour l'authentification, Prisma pour la base de données, et suit une architecture RESTful.

## Vue d'ensemble de l'API

- **URL de base**: `http://localhost:3000/api`
- **Authentification**: JWT Bearer Token
- **Format de données**: JSON
- **Validation**: Zod schemas
- **Base de données**: Prisma (PostgreSQL/MySQL/SQLite)

## Authentification

L'API utilise des tokens JWT pour sécuriser les endpoints. Les tokens doivent être inclus dans l'en-tête `Authorization` sous la forme `Bearer <token>`.

### Rôles d'utilisateur
- `USER`: Utilisateur standard
- `MODERATEUR`: Modérateur
- `ADMIN`: Administrateur

## Endpoints API

### Utilisateurs (/users)

#### Inscription (Public)
- **Méthode**: POST
- **URL**: `/api/users/register`
- **Corps de requête**:
```json
{
  "userName": "string",
  "email": "string",
  "password": "string (min 6 caractères)",
  "isVIP": "boolean (optionnel)"
}
```
- **Réponse**: Objet User

#### Connexion (Public)
- **Méthode**: POST
- **URL**: `/api/users/login`
- **Corps de requête**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Réponse**:
```json
{
  "token": "string"
}
```

#### Récupérer tous les utilisateurs (Admin requis)
- **Méthode**: GET
- **URL**: `/api/users`
- **Authentification**: Bearer Token (Admin)

#### Récupérer un utilisateur par ID (Authentifié requis)
- **Méthode**: GET
- **URL**: `/api/users/:id`
- **Authentification**: Bearer Token

#### Créer un utilisateur (Admin requis)
- **Méthode**: POST
- **URL**: `/api/users`
- **Authentification**: Bearer Token (Admin)
- **Corps**: Voir `CreateUser`

#### Mettre à jour un utilisateur (Admin requis)
- **Méthode**: PUT
- **URL**: `/api/users/:id`
- **Authentification**: Bearer Token (Admin)
- **Corps**: Voir `UpdateUser`

#### Supprimer un utilisateur (Admin requis)
- **Méthode**: DELETE
- **URL**: `/api/users/:id`
- **Authentification**: Bearer Token (Admin)

### Produits (/products)

#### Récupérer tous les produits
- **Méthode**: GET
- **URL**: `/api/products`

#### Récupérer un produit par ID
- **Méthode**: GET
- **URL**: `/api/products/:id`

#### Créer un produit
- **Méthode**: POST
- **URL**: `/api/products`
- **Corps**:
```json
{
  "title": "string",
  "description": "string",
  "price": "number (optionnel)",
  "userId": "number",
  "isApproved": "boolean (optionnel)",
  "priority": "boolean (optionnel)",
  "views": "number (optionnel)",
  "expiresAt": "Date"
}
```

#### Mettre à jour un produit
- **Méthode**: PUT
- **URL**: `/api/products/:id`
- **Corps**: Voir `UpdateProduct`

#### Supprimer un produit
- **Méthode**: DELETE
- **URL**: `/api/products/:id`

### Images de Produit (/product-images)

#### Récupérer toutes les images
- **Méthode**: GET
- **URL**: `/api/product-images`

#### Récupérer une image par ID
- **Méthode**: GET
- **URL**: `/api/product-images/:id`

#### Créer une image
- **Méthode**: POST
- **URL**: `/api/product-images`
- **Corps**:
```json
{
  "productId": "number",
  "url": "string"
}
```

#### Mettre à jour une image
- **Méthode**: PUT
- **URL**: `/api/product-images/:id`
- **Corps**: Voir `UpdateProductImage`

#### Supprimer une image
- **Méthode**: DELETE
- **URL**: `/api/product-images/:id`

### Notifications (/notifications)

#### Récupérer toutes les notifications
- **Méthode**: GET
- **URL**: `/api/notifications`

#### Récupérer une notification par ID
- **Méthode**: GET
- **URL**: `/api/notifications/:id`

#### Créer une notification
- **Méthode**: POST
- **URL**: `/api/notifications`
- **Corps**:
```json
{
  "userId": "number",
  "type": "REPUBLISH | GENERAL",
  "message": "string",
  "isRead": "boolean (optionnel)"
}
```

#### Mettre à jour une notification
- **Méthode**: PUT
- **URL**: `/api/notifications/:id`
- **Corps**: Voir `UpdateNotification`

#### Supprimer une notification
- **Méthode**: DELETE
- **URL**: `/api/notifications/:id`

### Catégories (/categories)

#### Récupérer toutes les catégories
- **Méthode**: GET
- **URL**: `/api/categories`

#### Récupérer une catégorie par ID
- **Méthode**: GET
- **URL**: `/api/categories/:id`

#### Créer une catégorie
- **Méthode**: POST
- **URL**: `/api/categories`
- **Corps**:
```json
{
  "name": "string"
}
```

#### Mettre à jour une catégorie
- **Méthode**: PUT
- **URL**: `/api/categories/:id`
- **Corps**:
```json
{
  "name": "string (optionnel)"
}
```

#### Supprimer une catégorie
- **Méthode**: DELETE
- **URL**: `/api/categories/:id`

### Logs de Modération (/moderation-logs)

#### Récupérer tous les logs
- **Méthode**: GET
- **URL**: `/api/moderation-logs`

#### Récupérer un log par ID
- **Méthode**: GET
- **URL**: `/api/moderation-logs/:id`

#### Créer un log
- **Méthode**: POST
- **URL**: `/api/moderation-logs`
- **Corps**:
```json
{
  "productId": "number",
  "moderatorId": "number",
  "action": "APPROVED | REJECTED",
  "reason": "string | null (optionnel)"
}
```

#### Mettre à jour un log
- **Méthode**: PUT
- **URL**: `/api/moderation-logs/:id`
- **Corps**: Voir `UpdateModerationLog`

#### Supprimer un log
- **Méthode**: DELETE
- **URL**: `/api/moderation-logs/:id`

## Intégration avec Angular

### Configuration de base

1. **Installer HttpClientModule**:
```typescript
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  // ...
})
export class AppModule {}
```

2. **Créer un service de configuration**:
```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api'
};
```

### Gestion de l'authentification

1. **Service d'authentification**:
```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // Decode token to get user info
      this.currentUserSubject.next(this.decodeToken(token));
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/login`, credentials)
      .pipe(
        tap((response: any) => {
          localStorage.setItem(this.tokenKey, response.token);
          this.currentUserSubject.next(this.decodeToken(response.token));
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string): any {
    // Implement JWT decoding (use jwt-decode library)
    return {}; // Decoded payload
  }
}
```

2. **Interceptor HTTP pour l'authentification**:
```typescript
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}

// app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}
```

### Services pour les entités

Exemple pour les produits:

```typescript
// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number | null;
  userId: number;
  isApproved: boolean;
  priority: boolean;
  views: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
  moderations?: ModerationLog[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`);
  }
}
```

Créez des services similaires pour User, Category, Notification, ProductImage, ModerationLog.

### Gestion des erreurs

```typescript
// error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Redirect to login or refresh token
        }
        return throwError(error);
      })
    );
  }
}
```

### Utilisation dans les composants

```typescript
// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from './product.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of products">
      <h3>{{ product.title }}</h3>
      <p>{{ product.description }}</p>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(products => {
      this.products = products;
    });
  }
}
```

## Codes d'erreur et de succès

### Codes de succès
- 200: OK
- 201: Created
- 204: No Content

### Codes d'erreur
- 400: Bad Request (validation Zod)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Bonnes pratiques

1. **Stockage du token**: Utilisez localStorage ou sessionStorage, mais soyez conscient des risques de sécurité.
2. **Refresh token**: Implémentez un mécanisme de rafraîchissement automatique du token.
3. **Validation côté client**: Utilisez les mêmes schémas Zod côté frontend pour la validation.
4. **Gestion d'état**: Utilisez NgRx ou Akita pour la gestion d'état complexe.
5. **Tests**: Écrivez des tests unitaires pour les services et des tests d'intégration pour les composants.

Cette documentation couvre l'intégration de base. Pour des fonctionnalités avancées comme le rafraîchissement de token ou la gestion d'état, consultez la documentation Angular officielle.
