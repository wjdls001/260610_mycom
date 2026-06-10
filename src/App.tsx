import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'

import { About } from './pages/about/About'
import { History } from './pages/about/History'
import { Organization } from './pages/about/Organization'
import { Location } from './pages/about/Location'

import { ProductList } from './pages/products/ProductList'
import { ProductDetail } from './pages/products/ProductDetail'
import { ProductWrite } from './pages/products/ProductWrite'

import { BoardList } from './pages/board/BoardList'
import { PostList } from './pages/board/PostList'
import { PostDetail } from './pages/board/PostDetail'
import { PostWrite } from './pages/board/PostWrite'
import { PostEdit } from './pages/board/PostEdit'

import { Contact } from './pages/contact/Contact'
import { ContactComplete } from './pages/contact/ContactComplete'
import { ProfileEdit } from './pages/profile/ProfileEdit'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="about" element={<About />} />
        <Route path="about/history" element={<History />} />
        <Route path="about/organization" element={<Organization />} />
        <Route path="about/location" element={<Location />} />

        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />

        <Route path="board" element={<BoardList />} />
        <Route path="board/:boardId" element={<PostList />} />
        <Route path="board/:boardId/:id" element={<PostDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="products/write" element={<ProductWrite />} />
          <Route path="board/:boardId/write" element={<PostWrite />} />
          <Route path="board/:boardId/:id/edit" element={<PostEdit />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
        </Route>

        <Route path="contact" element={<Contact />} />
        <Route path="contact/complete" element={<ContactComplete />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
