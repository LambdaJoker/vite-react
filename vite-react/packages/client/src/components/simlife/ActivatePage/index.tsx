import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import './index.css';

type SearchResult = {
  key: string;
  formatted: string;
  used: boolean;
  deviceCode: string;
  activationCode: string;
  usedAt: string;
};

type Product = {
  id: string;
  name: string;
  status: 'active' | 'coming-soon';
  note: string;
};

const PRODUCTS: Product[] = [
  { id: 'simlife-band', name: '腕上人生', status: 'active', note: '当前可激活' },
];

const formatDeviceCode = (value: string) => value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8);

const ActivatePage: React.FC = () => {
  const { deviceCode: pathDeviceCode } = useParams();
  const [searchParams] = useSearchParams();

  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0].id);
  const [cardKey, setCardKey] = useState('');
  const [deviceCode, setDeviceCode] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [searchDeviceCode, setSearchDeviceCode] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchMessage, setSearchMessage] = useState('');

  const activeProductInfo = useMemo(
    () => PRODUCTS.find((item) => item.id === activeProduct) || PRODUCTS[0],
    [activeProduct],
  );

  const setDeviceValue = (value: string) => {
    const normalized = formatDeviceCode(value);
    setDeviceCode(normalized);
    setSearchDeviceCode(normalized);
  };

  useEffect(() => {
    const fromQuery = searchParams.get('d') || searchParams.get('deviceCode') || searchParams.get('device_code') || '';
    const rawDeviceCode = fromQuery || pathDeviceCode || '';
    const normalized = formatDeviceCode(rawDeviceCode);

    if (normalized) {
      setDeviceValue(normalized);
      setNotice(`已识别设备码：${normalized}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathDeviceCode, searchParams]);

  const onGenerate = async () => {
    const nk = cardKey.trim().toUpperCase();
    const nd = deviceCode.trim().toUpperCase();
    setError('');
    setNotice('');
    setActivationCode('');

    if (!nk) {
      setError('请输入卡密');
      return;
    }

    if (!nd || nd.length !== 8) {
      setError('请输入 8 位设备码');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/card-service/activate', {
        cardKey: nk,
        deviceCode: nd,
        productId: activeProductInfo.id,
      });
      const code = res.data?.activationCode || '';
      setActivationCode(code);
      setNotice('激活码已生成，请回到手环填写。');
    } catch (e: any) {
      setError(e?.error || e?.message || '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async () => {
    const nd = searchDeviceCode.trim().toUpperCase();
    setSearchMessage('');
    setSearchResult(null);

    if (!nd || nd.length !== 8) {
      setSearchMessage('请输入 8 位设备码');
      return;
    }

    setSearchLoading(true);
    try {
      const res = await apiClient.get('/card-service/search', {
        params: { deviceCode: nd },
      });
      if (res.data?.success && res.data?.card) {
        setSearchResult(res.data.card);
        setSearchMessage('已找到对应激活信息');
      } else {
        setSearchMessage(res.data?.error || '未找到该设备码对应信息');
      }
    } catch (e: any) {
      setSearchMessage(e?.error || e?.message || '查询失败');
    } finally {
      setSearchLoading(false);
    }
  };

  const copyActivationCode = async () => {
    if (!activationCode) return;

    try {
      await navigator.clipboard.writeText(activationCode);
      setError('');
      setNotice('已复制激活码');
    } catch {
      setNotice('');
      setError('复制失败，请手动长按复制激活码');
    }
  };

  return (
    <div className="activate-page">
      <main className="activate-wrap">
        <header className="activate-hero">
          <span className="activate-brand">腕上人生</span>
          <h1>激活中心</h1>
          <p>选择商品，填写卡密和手环设备码，即可生成激活码。</p>
        </header>

        <section className="activate-card">
          <label className="activate-field">
            <span>商品</span>
            <select value={activeProduct} onChange={(event) => setActiveProduct(event.target.value)}>
              {PRODUCTS.map((product) => (
                <option key={product.id} value={product.id} disabled={product.status !== 'active'}>
                  {product.name} · {product.note}
                </option>
              ))}
            </select>
          </label>

          <div className="activate-guide">
            <span>操作指引</span>
            <p>在手环 App 到 激活 页面查看 8 位设备码，输入卡密后获取激活码。支持链接直接传设备码：/activate/ABCDEFGH 或 /activate?d=ABCDEFGH。</p>
          </div>

          <div className="activate-contact">
            若爱发电没有及时回复，请联系邮箱 2667534364@qq.com
          </div>

          <label className="activate-field">
            <span>设备码</span>
            <input
              value={deviceCode}
              onChange={(event) => setDeviceValue(event.target.value)}
              maxLength={8}
              inputMode="text"
              autoComplete="off"
              placeholder="请输入 8 位设备码"
            />
          </label>

          <label className="activate-field">
            <span>卡密</span>
            <input
              value={cardKey}
              onChange={(event) => setCardKey(event.target.value.toUpperCase())}
              maxLength={20}
              inputMode="text"
              autoComplete="off"
              placeholder="请输入购买后获得的卡密"
            />
          </label>

          <div className="activate-buy-tip">
            没有卡密？
            <a href="https://ifdian.net/item/edc5efce590a11f1a91652540025c377" target="_blank" rel="noreferrer">
              前往爱发电购买
            </a>
            。私信太久没回，可以联系邮箱 2667534364@qq.com
          </div>

          <button className="activate-primary" onClick={onGenerate} disabled={loading}>
            {loading ? '正在生成...' : '获取激活码'}
          </button>

          {error ? <div className="activate-alert error">{error}</div> : null}
          {notice ? <div className="activate-alert success">{notice}</div> : null}

          {activationCode ? (
            <div className="activate-result">
              <span>激活码</span>
              <strong>{activationCode}</strong>
              <button type="button" onClick={copyActivationCode}>
                复制
              </button>
            </div>
          ) : null}
        </section>

        <section className="activate-card secondary">
          <div className="section-title">
            <h2>查询激活信息</h2>
            <p>凭设备码查询对应卡密、激活码和使用状态。</p>
          </div>

          <label className="activate-field">
            <span>设备码</span>
            <input
              value={searchDeviceCode}
              onChange={(event) => setSearchDeviceCode(formatDeviceCode(event.target.value))}
              maxLength={8}
              inputMode="text"
              autoComplete="off"
              placeholder="请输入设备码"
            />
          </label>

          <button className="activate-secondary" onClick={onSearch} disabled={searchLoading}>
            {searchLoading ? '查询中...' : '查询'}
          </button>

          {searchMessage ? <div className="activate-alert neutral">{searchMessage}</div> : null}

          {searchResult ? (
            <div className="search-result">
              <div><span>卡密</span><strong>{searchResult.formatted}</strong></div>
              <div><span>状态</span><strong>{searchResult.used ? '已使用' : '未使用'}</strong></div>
              <div><span>设备码</span><strong>{searchResult.deviceCode || '-'}</strong></div>
              <div><span>激活码</span><strong>{searchResult.activationCode || '-'}</strong></div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default ActivatePage;
