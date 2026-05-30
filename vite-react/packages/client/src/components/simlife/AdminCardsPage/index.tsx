import { useEffect, useMemo, useState } from 'react';
import apiClient from '@/api/apiClient';
import './index.css';

type CardRow = {
  key: string;
  formatted: string;
  productId: string;
  productName: string;
  used: boolean;
  activationCode: string;
  deviceCode: string;
  usedAt: string;
};

type Product = {
  id: string;
  name: string;
  prefix: string;
  active: boolean;
};

const PAGE_SIZE = 10;
const FALLBACK_PRODUCTS: Product[] = [{ id: 'simlife-band', name: '腕上人生', prefix: 'SL', active: true }];

const AdminCardsPage: React.FC = () => {
  const [adminKey, setAdminKey] = useState(localStorage.getItem('card_admin_key') || '');
  const [loginValue, setLoginValue] = useState(localStorage.getItem('card_admin_key') || '');
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [total, setTotal] = useState(0);
  const [used, setUsed] = useState(0);
  const [unused, setUnused] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'all' | 'used' | 'unused'>('all');
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [productId, setProductId] = useState('simlife-band');
  const [filterProductId, setFilterProductId] = useState('all');
  const [query, setQuery] = useState('');
  const [deviceCode, setDeviceCode] = useState('');
  const [message, setMessage] = useState('');
  const [genCount, setGenCount] = useState(10);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const loadProducts = async () => {
    try {
      const res = await apiClient.get('/card-service/products');
      if (res.data?.success) {
        const list = res.data.products?.length ? res.data.products : FALLBACK_PRODUCTS;
        setProducts(list);
        const firstActive = list.find((item: Product) => item.active);
        if (firstActive) setProductId(firstActive.id);
      }
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    }
  };

  const loadCards = async (nextPage = page, nextStatus = status, nextQuery = query, nextDeviceCode = deviceCode, nextProductId = filterProductId, keyOverride = adminKey) => {
    if (!keyOverride) return;
    setLoading(true);
    try {
      const res = await apiClient.get('/card-service/cards', {
        params: {
          adminKey: keyOverride,
          page: nextPage,
          pageSize: PAGE_SIZE,
          status: nextStatus,
          productId: nextProductId,
          query: nextQuery.trim(),
          deviceCode: nextDeviceCode.trim().toUpperCase(),
        },
      });
      if (res.data?.success) {
        setCards(res.data.cards || []);
        setTotal(res.data.total || 0);
        setUsed(res.data.used || 0);
        setUnused(res.data.unused || 0);
        setPage(res.data.page || nextPage);
        setMessage('');
      } else {
        setMessage(res.data?.error || '加载失败');
      }
    } catch (e: any) {
      setMessage(e?.error || e?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const doLogin = async () => {
    const key = loginValue.trim();
    if (!key) {
      setMessage('请输入管理员密钥');
      return;
    }
    setAdminKey(key);
    localStorage.setItem('card_admin_key', key);
    setIsAuthed(true);
    await loadCards(1, status, query, deviceCode, key);
  };

  const doLogout = () => {
    localStorage.removeItem('card_admin_key');
    setAdminKey('');
    setLoginValue('');
    setIsAuthed(false);
    setCards([]);
    setTotal(0);
    setUsed(0);
    setUnused(0);
  };

  useEffect(() => {
    if (adminKey) {
      setIsAuthed(true);
      loadProducts();
      loadCards(1, 'all', '', '', 'all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async () => {
    await loadCards(1, status, query, deviceCode, filterProductId);
  };

  const onGenerate = async () => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const res = await apiClient.post('/card-service/generate-cards', {
        adminKey,
        productId,
        count: Math.min(Math.max(1, Number(genCount) || 10), 100),
      });
      if (res.data?.success) {
        await loadCards(1, status, query, deviceCode, filterProductId);
      } else {
        setMessage(res.data?.error || '生成失败');
      }
    } catch (e: any) {
      setMessage(e?.error || e?.message || '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const actionCard = async (cardKey: string, action: 'reset' | 'delete') => {
    if (!adminKey) return;
    if (action === 'reset' && !window.confirm('确定重置该卡密？重置后可重新使用。')) return;
    if (action === 'delete' && !window.confirm('确定删除该卡密？此操作不可恢复。')) return;
    setLoading(true);
    try {
      const res = await apiClient.post('/card-service/cards', {
        adminKey,
        cardKey,
        action,
      });
      if (res.data?.success) {
        await loadCards(page, status, query, deviceCode, filterProductId);
      } else {
        setMessage(res.data?.error || '操作失败');
      }
    } catch (e: any) {
      setMessage(e?.error || e?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const exportParams = () => ({
    adminKey,
    status,
    productId: filterProductId,
    query: query.trim(),
    deviceCode: deviceCode.trim().toUpperCase(),
  });

  const copyAllKeys = async () => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const res = await apiClient.get('/card-service/cards', {
        params: {
          ...exportParams(),
          exportMode: 'keys',
        },
      });
      const keys = res.data?.keys || [];
      if (!keys.length) {
        setMessage('当前条件下没有可复制的卡密');
        return;
      }
      await navigator.clipboard.writeText(keys.join('\n'));
      setMessage(`已复制 ${keys.length} 个卡密`);
    } catch (e: any) {
      setMessage(e?.error || e?.message || '复制失败');
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = async () => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const res = await apiClient.get('/card-service/cards', {
        params: {
          ...exportParams(),
          exportMode: 'csv',
        },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `simlife-cards-${status}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage('已导出 CSV 文件');
    } catch (e: any) {
      setMessage(e?.error || e?.message || '导出失败');
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (usedFlag: boolean) => (usedFlag ? <span className="badge used">已使用</span> : <span className="badge unused">未使用</span>);

  return (
    <div className="admin-shell">
      <div className="admin-panel">
        <div className="admin-header">
          <div>
            <div className="kicker">腕上人生 · 卡密管理</div>
            <h1>卡密后台</h1>
            <p>支持搜索、筛选和分页加载，每页只取 10 条。</p>
          </div>
          {isAuthed ? (
            <button className="ghost-btn" onClick={doLogout}>退出登录</button>
          ) : null}
        </div>

        {!isAuthed ? (
          <section className="login-card">
            <label>
              管理员密钥
              <input value={loginValue} onChange={(e) => setLoginValue(e.target.value)} type="password" placeholder="请输入管理员密钥" />
            </label>
            <button className="primary-btn" onClick={doLogin}>登录后台</button>
            {message ? <div className="state">{message}</div> : null}
          </section>
        ) : (
          <>
            <section className="stats-row">
              <div className="stat-card">
                <span>总数</span>
                <strong>{total}</strong>
              </div>
              <div className="stat-card">
                <span>已使用</span>
                <strong>{used}</strong>
              </div>
              <div className="stat-card">
                <span>未使用</span>
                <strong>{unused}</strong>
              </div>
            </section>

            <section className="controls-card">
              <div className="grid-2">
                <label>
                  商品筛选
                  <select value={filterProductId} onChange={(e) => { setFilterProductId(e.target.value); loadCards(1, status, query, deviceCode, e.target.value); }}>
                    <option value="all">全部商品</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  卡密 / 设备码 / 激活码
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="输入关键字" />
                </label>
                <label>
                  设备码
                  <input value={deviceCode} onChange={(e) => setDeviceCode(e.target.value.toUpperCase())} maxLength={8} placeholder="8位设备码" />
                </label>
              </div>
              <div className="filters">
                <button className={status === 'all' ? 'filter active' : 'filter'} onClick={() => { setStatus('all'); loadCards(1, 'all', query, deviceCode, filterProductId); }}>全部</button>
                <button className={status === 'used' ? 'filter active' : 'filter'} onClick={() => { setStatus('used'); loadCards(1, 'used', query, deviceCode, filterProductId); }}>已使用</button>
                <button className={status === 'unused' ? 'filter active' : 'filter'} onClick={() => { setStatus('unused'); loadCards(1, 'unused', query, deviceCode, filterProductId); }}>未使用</button>
                <button className="primary-btn small" onClick={onSearch}>搜索</button>
              </div>
            </section>

            <section className="controls-card">
              <div className="grid-2">
                <label>
                  生成商品
                  <select value={productId} onChange={(e) => setProductId(e.target.value)}>
                    {products.filter((product) => product.active).map((product) => (
                      <option key={product.id} value={product.id}>{product.name} · {product.prefix}</option>
                    ))}
                  </select>
                </label>
                <label>
                  生成数量
                  <input type="number" min={1} max={100} value={genCount} onChange={(e) => setGenCount(Number(e.target.value) || 10)} />
                </label>
                <button className="primary-btn" onClick={onGenerate} disabled={loading}>生成卡密</button>
              </div>
            </section>

            <section className="table-card">
              <div className="table-head">
                <div>
                  <strong>卡密列表</strong>
                  <span>每页 {PAGE_SIZE} 条</span>
                </div>
                <div className="table-tools">
                  <button className="ghost-btn small" onClick={copyAllKeys} disabled={loading}>复制全部卡密</button>
                  <button className="primary-btn small" onClick={exportCsv} disabled={loading}>导出 CSV</button>
                </div>
              </div>
              {message ? <div className="state error">{message}</div> : null}
              {loading && cards.length === 0 ? <div className="state">加载中...</div> : null}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>卡密</th>
                      <th>商品</th>
                      <th>状态</th>
                      <th>激活码</th>
                      <th>设备码</th>
                      <th>使用时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty">暂无数据</td>
                      </tr>
                    ) : cards.map((card) => (
                      <tr key={card.key}>
                        <td><span className="mono">{card.formatted}</span></td>
                        <td>{card.productName || '-'}</td>
                        <td>{renderStatus(card.used)}</td>
                        <td><span className="mono accent">{card.activationCode || '-'}</span></td>
                        <td><span className="mono">{card.deviceCode || '-'}</span></td>
                        <td>{card.usedAt ? new Date(card.usedAt).toLocaleString('zh-CN') : '-'}</td>
                        <td>
                          <div className="actions">
                            {card.used ? <button className="ghost-btn small" onClick={() => actionCard(card.key, 'reset')}>重置</button> : null}
                            <button className="danger-btn small" onClick={() => actionCard(card.key, 'delete')}>删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pager">
                <button className="ghost-btn" disabled={page <= 1 || loading} onClick={() => loadCards(page - 1, status, query, deviceCode, filterProductId)}>上一页</button>
                <span>
                  第 {page} / {totalPages} 页，共 {total} 条
                </span>
                <button className="ghost-btn" disabled={page >= totalPages || loading} onClick={() => loadCards(page + 1, status, query, deviceCode, filterProductId)}>下一页</button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCardsPage;
