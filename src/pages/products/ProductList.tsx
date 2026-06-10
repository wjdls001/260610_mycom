import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../../components/ui/Spinner'

const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`

export const ProductList = () => {
  const { products, loading, error } = useProducts()
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">제품소개</h1>
          <p className="mt-2 text-gray-500">mycompany가 제안하는 제품과 서비스를 만나보세요.</p>
        </div>
        {isAdmin && (
          <Link
            to="/products/write"
            className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            + 제품 등록
          </Link>
        )}
      </header>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="py-12 text-center text-gray-500">등록된 제품이 없습니다.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-card transition-shadow hover:shadow-modal"
            >
              <span className="w-fit rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                {product.category}
              </span>
              <h2 className="mt-3 font-semibold text-gray-800">{product.name}</h2>
              <p className="mt-2 flex-1 text-sm text-gray-500">{product.summary}</p>
              <p className="mt-4 font-semibold text-primary">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
