import { componentReference } from './component-reference';

export default function ComponentAPI({
  name,
  locale = 'ru',
}: {
  name: string;
  locale?: 'ru' | 'en';
}) {
  const reference = componentReference[name];
  if (!reference) return null;

  return (
    <section className='docs-component-api'>
      {reference.parts && (
        <p>
          {locale === 'ru' ? 'Составные части: ' : 'Compound parts: '}
          {reference.parts.map((part, index) => (
            <span key={part}>
              {index > 0 && ', '}
              <code>{`${name}.${part}`}</code>
            </span>
          ))}
          .
        </p>
      )}
      {[
        { key: 'props', props: reference.props.filter((prop) => !prop.demoOnly) },
        { key: 'returns', props: reference.returns ?? [] },
      ]
        .filter(({ props }) => props.length > 0)
        .map(({ key, props }) => (
          <div key={key}>
            {reference.kind === 'hook' && (
              <h3>
                {key === 'props'
                  ? locale === 'ru'
                    ? 'Параметры'
                    : 'Parameters'
                  : locale === 'ru'
                    ? 'Возвращает'
                    : 'Returns'}
              </h3>
            )}
            <div className='docs-component-api-scroll'>
              <table>
                <thead>
                  <tr>
                    <th>
                      {reference.kind === 'hook'
                        ? key === 'props'
                          ? locale === 'ru'
                            ? 'Параметр'
                            : 'Parameter'
                          : locale === 'ru'
                            ? 'Значение'
                            : 'Value'
                        : 'Prop'}
                    </th>
                    <th>{locale === 'ru' ? 'Тип / варианты' : 'Type / variants'}</th>
                    <th>{locale === 'ru' ? 'Назначение' : 'Purpose'}</th>
                    {key === 'props' && <th>{locale === 'ru' ? 'По умолчанию' : 'Default'}</th>}
                  </tr>
                </thead>
                <tbody>
                  {props.map((prop) => (
                    <tr key={prop.name}>
                      <td>
                        <code>{prop.part ? `${name}.${prop.part}.${prop.name}` : prop.name}</code>
                      </td>
                      <td>
                        <code>{prop.type}</code>
                        {prop.options && <small>{prop.options.join(' · ')}</small>}
                      </td>
                      <td>{prop[locale]}</td>
                      {key === 'props' && (
                        <td>
                          {prop.default === undefined ? '—' : <code>{String(prop.default)}</code>}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      {reference.kind !== 'hook' && (
        <p className='docs-component-api-note'>
          {locale === 'ru'
            ? 'Нативные HTML-атрибуты поддерживаются там, где компонент рендерит соответствующий элемент. Параметры className управляют только оформлением.'
            : 'Native HTML attributes are accepted where the component renders the corresponding element. className props only affect styling.'}
        </p>
      )}
    </section>
  );
}
