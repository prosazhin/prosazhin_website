'use client';

import {
  ArrowRightStartOnRectangleIcon,
  CheckIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Collapse,
  CollapseGroup,
  Container,
  Content,
  Dialog,
  DialogProvider,
  Dropdown,
  DropdownItem,
  Field,
  Headline,
  Icon,
  InlineRadio,
  InlineRadioGroup,
  Input,
  Notification,
  NotificationsProvider,
  PBCProvider,
  Radio,
  RadioGroup,
  Search,
  Select,
  Switch,
  Tab,
  Tabs,
  Tag,
  Text,
  Textarea,
  useDialog,
  useNotifications,
  useShowDialog,
} from '@prosazhin/pbcomponents';
import { useState } from 'react';

import { componentReference } from './component-reference';

const options = [
  { display: 'One', value: '1' },
  { display: 'Two', value: '2' },
  { display: 'Three', value: '3' },
  { display: 'Four', value: '4' },
  { display: 'Five', value: '5' },
];

const icons = {
  check: CheckIcon,
  search: MagnifyingGlassIcon,
  user: UserCircleIcon,
};

const controlLabels: Record<string, { ru: string; en: string }> = {
  children: { ru: 'Текст', en: 'Text' },
  label: { ru: 'Подпись', en: 'Label' },
  title: { ru: 'Заголовок', en: 'Title' },
  description: { ru: 'Описание', en: 'Description' },
  header: { ru: 'Заголовок', en: 'Header' },
  body: { ru: 'Содержимое', en: 'Body' },
  headline: { ru: 'Заголовок', en: 'Headline' },
  summary: { ru: 'Заголовок секции', en: 'Summary' },
  size: { ru: 'Размер', en: 'Size' },
  color: { ru: 'Цвет', en: 'Color' },
  theme: { ru: 'Вариант', en: 'Theme' },
  as: { ru: 'HTML-тег', en: 'HTML tag' },
  type: { ru: 'Тип', en: 'Type' },
  checked: { ru: 'Выбран', en: 'Checked' },
  indeterminate: { ru: 'Частичный выбор', en: 'Indeterminate' },
  active: { ru: 'Активен', en: 'Active' },
  indicator: { ru: 'Индикатор', en: 'Indicator' },
  open: { ru: 'Открыт', en: 'Open' },
  disabled: { ru: 'Недоступен', en: 'Disabled' },
  loading: { ru: 'Загрузка', en: 'Loading' },
  error: { ru: 'Ошибка', en: 'Error' },
  medium: { ru: 'Насыщенный', en: 'Medium weight' },
  leftIcon: { ru: 'Иконка слева', en: 'Left icon' },
  rightIcon: { ru: 'Иконка справа', en: 'Right icon' },
  icon: { ru: 'Иконка', en: 'Icon' },
  tag: { ru: 'Иконка', en: 'Icon' },
  labelPlace: { ru: 'Положение подписи', en: 'Label position' },
  itemType: { ru: 'Тип пунктов', en: 'Item type' },
  control: { ru: 'Контрол', en: 'Control' },
  addon: { ru: 'Дополнение', en: 'Addon' },
  align: { ru: 'Выравнивание', en: 'Alignment' },
  placeholder: { ru: 'Подсказка', en: 'Placeholder' },
  multiple: { ru: 'Множественный выбор', en: 'Multiple' },
  search: { ru: 'Поиск по вариантам', en: 'Search choices' },
  borderTop: { ru: 'Разделитель сверху', en: 'Top divider' },
  borderBottom: { ru: 'Разделитель снизу', en: 'Bottom divider' },
  badge: { ru: 'Бейдж', en: 'Badge' },
  defaultIndex: { ru: 'Начальная вкладка', en: 'Initial tab' },
  joined: { ru: 'Объединить секции', en: 'Join sections' },
  actions: { ru: 'Действия', en: 'Actions' },
  backdrop: { ru: 'Затемнение', en: 'Backdrop' },
  animationDuration: { ru: 'Анимация, мс', en: 'Animation, ms' },
  dialogDuration: { ru: 'Анимация диалога, мс', en: 'Dialog animation, ms' },
  notificationTop: { ru: 'Отступ уведомления, px', en: 'Notification offset, px' },
  top: { ru: 'Отступ сверху, px', en: 'Top offset, px' },
  delay: { ru: 'Время показа, мс', en: 'Duration, ms' },
  estimatedNotificationHeight: { ru: 'Высота уведомления, px', en: 'Estimated height, px' },
  disableTimer: { ru: 'Без таймера', en: 'Disable timer' },
  disableProgressBar: { ru: 'Без индикатора времени', en: 'Hide progress bar' },
  disableTimerPauseOnHover: { ru: 'Не останавливать при наведении', en: 'Keep timer on hover' },
  disableTimerPauseOnContainerHover: {
    ru: 'Не останавливать над контейнером',
    en: 'Keep timer over container',
  },
  disableCloseByClickInsideAnywhere: {
    ru: 'Не закрывать по нажатию',
    en: 'Disable click to close',
  },
  leftAside: { ru: 'Левая колонка', en: 'Left sidebar' },
  rightAside: { ru: 'Правая колонка', en: 'Right sidebar' },
  href: { ru: 'Адрес ссылки', en: 'Link URL' },
  target: { ru: 'Открыть в', en: 'Link target' },
};

export default function ComponentShowcase({
  name,
  locale = 'ru',
}: {
  name: string;
  locale?: 'ru' | 'en';
}) {
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState('One');
  const [items, setItems] = useState<string[]>(['One']);
  const [controlValues, setControlValues] = useState<Record<string, string | number | boolean>>({});
  const reference = componentReference[name];
  const controls = Object.fromEntries(
    (reference?.props ?? [])
      .filter((prop) => prop.control)
      .map((prop) => [prop.name, controlValues[prop.name] ?? prop.initial ?? prop.default])
  );
  const size = controls.size as 'xs' | 's' | 'm' | 'l';
  const color = controls.color as 'primary' | 'secondary' | 'success' | 'danger';
  const theme = controls.theme as 'filled' | 'light' | 'border' | 'ghost';
  const disabled = Boolean(controls.disabled);
  const loading = Boolean(controls.loading);
  const checked = Boolean(controls.checked);
  const leftIcon = icons[controls.leftIcon as keyof typeof icons];
  const rightIcon = icons[controls.rightIcon as keyof typeof icons];
  const sample = locale === 'ru' ? 'Пример' : 'Example';
  let preview;

  switch (name) {
    case 'Button':
      preview = (
        <Button
          size={size}
          color={color}
          theme={theme}
          disabled={disabled}
          loading={loading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          href={String(controls.href) || undefined}
          target={controls.target as '_self' | '_blank'}
          type={controls.type as 'button' | 'reset' | 'submit'}
        >
          {String(controls.children)}
        </Button>
      );
      break;
    case 'ButtonGroup':
      preview = (
        <ButtonGroup size={size}>
          <Button theme='border'>One</Button>
          <Button theme='border'>Two</Button>
          <Dropdown>
            <Dropdown.Trigger theme='border'>Three</Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>One</Dropdown.Item>
              <Dropdown.Item>Two</Dropdown.Item>
              <Dropdown.Item>Three</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </ButtonGroup>
      );
      break;
    case 'Badge':
      preview = (
        <Badge
          size={size as 's' | 'm'}
          color={color}
          theme={theme as 'filled' | 'light' | 'border'}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        >
          {String(controls.children)}
        </Badge>
      );
      break;
    case 'Tag':
      preview = (
        <Tag
          size={size as 's' | 'm'}
          theme={theme as 'light' | 'border'}
          checked={checked}
          disabled={disabled}
          loading={loading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          href={String(controls.href) || undefined}
          target={controls.target as '_self' | '_blank'}
          type={controls.type as 'button' | 'reset' | 'submit'}
          onClick={() => setControlValues({ ...controlValues, checked: !checked })}
        >
          {String(controls.children)}
        </Tag>
      );
      break;
    case 'Checkbox':
      preview = (
        <Checkbox
          checked={checked}
          onChange={(next) => setControlValues({ ...controlValues, checked: next })}
          value='design'
          size={size as 's' | 'm'}
          labelPlace={controls.labelPlace as 'left' | 'right'}
          disabled={disabled}
          indeterminate={Boolean(controls.indeterminate)}
        >
          {String(controls.children)}
        </Checkbox>
      );
      break;
    case 'CheckboxGroup':
      preview = (
        <CheckboxGroup
          value={items}
          onChange={setItems}
          size={size as 's' | 'm'}
          disabled={disabled}
        >
          {['One', 'Two', 'Three', 'Four', 'Five'].map((item) =>
            controls.itemType === 'Switch' ? (
              <Switch
                key={item}
                value={item}
              >
                {item}
              </Switch>
            ) : (
              <Checkbox
                key={item}
                value={item}
              >
                {item}
              </Checkbox>
            )
          )}
        </CheckboxGroup>
      );
      break;
    case 'Switch':
      preview = (
        <Switch
          checked={checked}
          onChange={(next) => setControlValues({ ...controlValues, checked: next })}
          value='notifications'
          size={size as 's' | 'm'}
          labelPlace={controls.labelPlace as 'left' | 'right'}
          disabled={disabled}
        >
          {String(controls.children)}
        </Switch>
      );
      break;
    case 'Radio':
      preview = (
        <Radio
          name='docs-radio'
          value='One'
          checked={checked}
          onChange={(next) => setControlValues({ ...controlValues, checked: next })}
          size={size as 's' | 'm'}
          labelPlace={controls.labelPlace as 'left' | 'right'}
          disabled={disabled}
        >
          {String(controls.children)}
        </Radio>
      );
      break;
    case 'RadioGroup':
      preview = (
        <RadioGroup
          value={selected}
          onChange={(_, next) => setSelected(next)}
          size={size as 's' | 'm'}
          disabled={disabled}
        >
          {['One', 'Two', 'Three', 'Four', 'Five'].map((item) => (
            <Radio
              key={item}
              value={item}
            >
              {item}
            </Radio>
          ))}
        </RadioGroup>
      );
      break;
    case 'InlineRadio':
      preview = (
        <InlineRadio
          checked={checked}
          onChange={(next) => setControlValues({ ...controlValues, checked: next })}
          value='One'
          size={size as 's' | 'm'}
          disabled={disabled}
        >
          {String(controls.children)}
        </InlineRadio>
      );
      break;
    case 'InlineRadioGroup':
      preview = (
        <InlineRadioGroup
          value={selected}
          onChange={(_, next) => setSelected(next)}
          size={size as 's' | 'm'}
          disabled={disabled}
        >
          {['One', 'Two', 'Three', 'Four', 'Five'].map((item) => (
            <InlineRadio
              key={item}
              value={item}
            >
              {item}
            </InlineRadio>
          ))}
        </InlineRadioGroup>
      );
      break;
    case 'Input':
      preview = (
        <div className='docs-showcase-field'>
          <Input
            size={size as 's' | 'm'}
            disabled={disabled}
            error={Boolean(controls.error)}
          >
            {controls.addon === 'left' && (
              <Input.LeftAddon>
                <Button
                  color='secondary'
                  theme='border'
                >
                  Button
                </Button>
              </Input.LeftAddon>
            )}
            <Input.Control
              value={value}
              onChange={setValue}
              placeholder={String(controls.placeholder)}
              type={String(controls.type)}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
            />
            {controls.addon === 'right' && (
              <Input.RightAddon>
                <Button
                  color='secondary'
                  theme='border'
                >
                  Button
                </Button>
              </Input.RightAddon>
            )}
          </Input>
        </div>
      );
      break;
    case 'Textarea':
      preview = (
        <div className='docs-showcase-field'>
          <Textarea
            value={value}
            onChange={setValue}
            placeholder={String(controls.placeholder)}
            size={size as 's' | 'm'}
            disabled={disabled}
            error={Boolean(controls.error)}
          />
        </div>
      );
      break;
    case 'Select':
      preview = (
        <div className='docs-showcase-field'>
          <Select
            key={String(controls.multiple)}
            options={options}
            placeholder={String(controls.placeholder)}
            size={size as 's' | 'm'}
            disabled={disabled}
            error={Boolean(controls.error)}
            search={Boolean(controls.search)}
            {...(controls.multiple ? { multiple: true as const } : { multiple: false as const })}
          />
        </div>
      );
      break;
    case 'Search':
      preview = (
        <div className='docs-showcase-field'>
          <Search
            key={String(controls.multiple)}
            options={options}
            placeholder={String(controls.placeholder)}
            size={size as 's' | 'm'}
            disabled={disabled}
            error={Boolean(controls.error)}
            {...(controls.multiple ? { multiple: true as const } : { multiple: false as const })}
          />
        </div>
      );
      break;
    case 'Field':
      preview = (
        <div className='docs-showcase-field'>
          <Field
            error={Boolean(controls.error)}
            disabled={disabled}
          >
            <Field.Label>{String(controls.label)}</Field.Label>
            <Field.Control>
              {controls.control === 'Input' && (
                <Input>
                  <Input.Control
                    value={value}
                    onChange={setValue}
                    placeholder='Placeholder'
                  />
                </Input>
              )}
              {controls.control === 'Textarea' && (
                <Textarea
                  value={value}
                  onChange={setValue}
                  placeholder='Message'
                />
              )}
              {controls.control === 'Select' && (
                <Select
                  options={options}
                  placeholder='Choose an option'
                />
              )}
              {controls.control === 'Search' && (
                <Search
                  options={options}
                  placeholder='Search an option'
                />
              )}
            </Field.Control>
            <Field.Description>{String(controls.description)}</Field.Description>
          </Field>
        </div>
      );
      break;
    case 'Dropdown':
      preview = (
        <Dropdown>
          <Dropdown.Trigger>{locale === 'ru' ? 'Открыть меню' : 'Open menu'}</Dropdown.Trigger>
          <Dropdown.Content align={controls.align as 'left' | 'right'}>
            <Dropdown.Item
              leftIcon={UserCircleIcon}
              badge={<Badge color='secondary'>2</Badge>}
            >
              {locale === 'ru' ? 'Мои заказы' : 'My orders'}
            </Dropdown.Item>
            <Dropdown.Item leftIcon={Cog6ToothIcon}>
              {locale === 'ru' ? 'Настройки профиля' : 'Profile settings'}
            </Dropdown.Item>
            <Dropdown.Item
              borderTop
              leftIcon={ArrowRightStartOnRectangleIcon}
            >
              {locale === 'ru' ? 'Выйти' : 'Sign out'}
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      break;
    case 'DropdownItem':
      preview = (
        <div className='docs-showcase-menu'>
          <DropdownItem
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            href={String(controls.href) || undefined}
            target={controls.target as '_self' | '_blank'}
            type={controls.type as 'button' | 'reset' | 'submit'}
            disabled={disabled}
            borderTop={Boolean(controls.borderTop)}
            borderBottom={Boolean(controls.borderBottom)}
            badge={controls.badge ? <Badge color='secondary'>2</Badge> : undefined}
          >
            {String(controls.children)}
          </DropdownItem>
        </div>
      );
      break;
    case 'Tabs':
      preview = (
        <Tabs
          key={String(controls.defaultIndex)}
          defaultIndex={Number(controls.defaultIndex)}
        >
          {['One', 'Two', 'Three', 'Four', 'Five'].map((label) => (
            <Tab
              key={label}
              label={label}
            >
              <div className='docs-showcase-tab-content'>{`Content for "${label}" tab`}</div>
            </Tab>
          ))}
        </Tabs>
      );
      break;
    case 'Tab':
      preview = (
        <div className='docs-showcase-tabs'>
          <Tab
            active={Boolean(controls.active)}
            indicator={Boolean(controls.indicator)}
            disabled={disabled}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            label={String(controls.label)}
            href={String(controls.href) || undefined}
            target={controls.target as '_self' | '_blank'}
            type={controls.type as 'button' | 'reset' | 'submit'}
          />
        </div>
      );
      break;
    case 'Collapse':
      preview = (
        <div className='docs-showcase-field'>
          <Collapse
            summary={String(controls.summary)}
            open={Boolean(controls.open)}
            onToggle={(event) =>
              setControlValues({ ...controlValues, open: event.currentTarget.open })
            }
          >
            <p>{locale === 'ru' ? 'Содержимое раздела' : 'Collapse item content'}</p>
          </Collapse>
        </div>
      );
      break;
    case 'CollapseGroup':
      preview = (
        <div className='docs-showcase-field'>
          <CollapseGroup
            joined={Boolean(controls.joined)}
            name='docs-collapse-group'
          >
            {['One', 'Two', 'Three', 'Four', 'Five'].map((item) => (
              <Collapse
                key={item}
                summary={item}
              >
                <p>{`Content for ${item}`}</p>
              </Collapse>
            ))}
          </CollapseGroup>
        </div>
      );
      break;
    case 'Alert':
      preview = (
        <div className='docs-showcase-field'>
          <Alert
            color={color}
            open={Boolean(controls.open)}
            onOpenChange={(next) => setControlValues({ ...controlValues, open: next })}
          >
            <Alert.Title as={controls.as as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'}>
              {String(controls.title)}
            </Alert.Title>
            <Alert.Description>{String(controls.description)}</Alert.Description>
            {controls.actions && (
              <Alert.Actions>
                <Button
                  color='secondary'
                  size='s'
                >
                  One
                </Button>
                <Button
                  color='secondary'
                  size='s'
                >
                  Two
                </Button>
              </Alert.Actions>
            )}
          </Alert>
        </div>
      );
      break;
    case 'Dialog':
      preview = (
        <Dialog
          id='docs-dialog-example'
          open={Boolean(controls.open)}
          onOpenChange={(next) => setControlValues({ ...controlValues, open: next })}
          backdrop={Boolean(controls.backdrop)}
          animationDuration={Number(controls.animationDuration)}
        >
          <Dialog.Trigger
            color='primary'
            theme='filled'
          >
            {locale === 'ru' ? 'Открыть диалог' : 'Open dialog'}
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>{String(controls.header)}</Dialog.Header>
            <Dialog.Body>
              <p>{String(controls.body)}</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close
                color='secondary'
                theme='border'
              >
                Close
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      );
      break;
    case 'DialogProvider':
      preview = (
        <DialogProvider animationDuration={Number(controls.animationDuration)}>
          <ProviderDialogButton locale={locale} />
        </DialogProvider>
      );
      break;
    case 'PBCProvider':
      preview = (
        <PBCProvider
          dialog={{ animationDuration: Number(controls.dialogDuration) }}
          notifications={{ top: Number(controls.notificationTop) }}
        >
          <ProviderDialogButton locale={locale} />
        </PBCProvider>
      );
      break;
    case 'Notification':
      preview = (
        <>
          <Button onClick={() => setControlValues({ ...controlValues, open: true })}>
            {locale === 'ru' ? 'Показать уведомление' : 'Show notification'}
          </Button>
          <Notification
            headline={String(controls.headline)}
            open={Boolean(controls.open)}
            onOpenChange={(next) => setControlValues({ ...controlValues, open: next })}
            icon={icons[controls.icon as keyof typeof icons]}
            top={Number(controls.top)}
            delay={Number(controls.delay)}
            animationDuration={Number(controls.animationDuration)}
            disableTimer={Boolean(controls.disableTimer)}
            disableProgressBar={Boolean(controls.disableProgressBar)}
            disableTimerPauseOnHover={Boolean(controls.disableTimerPauseOnHover)}
            disableCloseByClickInsideAnywhere={Boolean(controls.disableCloseByClickInsideAnywhere)}
          >
            {String(controls.children)}
          </Notification>
        </>
      );
      break;
    case 'NotificationsProvider':
      preview = (
        <NotificationsProvider
          top={Number(controls.top)}
          delay={Number(controls.delay)}
          animationDuration={Number(controls.animationDuration)}
          estimatedNotificationHeight={Number(controls.estimatedNotificationHeight)}
          disableTimer={Boolean(controls.disableTimer)}
          disableProgressBar={Boolean(controls.disableProgressBar)}
          disableTimerPauseOnHover={Boolean(controls.disableTimerPauseOnHover)}
          disableTimerPauseOnContainerHover={Boolean(controls.disableTimerPauseOnContainerHover)}
          disableCloseByClickInsideAnywhere={Boolean(controls.disableCloseByClickInsideAnywhere)}
        >
          <NotificationsDemoButton locale={locale} />
        </NotificationsProvider>
      );
      break;
    case 'Headline':
      preview = (
        <div className='docs-showcase-field'>
          <Headline as={controls.as as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'}>
            {String(controls.children)}
          </Headline>
        </div>
      );
      break;
    case 'Container':
      preview = (
        <div className='docs-showcase-field'>
          <Container size={controls.size as 'full' | 'm' | 's'}>
            {controls.leftAside && (
              <Container.LeftAside>
                <div className='docs-showcase-block'>
                  {locale === 'ru' ? 'Боковая колонка' : 'Sidebar'}
                </div>
              </Container.LeftAside>
            )}
            <Container.Main>
              <div className='docs-showcase-block'>
                {locale === 'ru' ? 'Основное содержимое' : 'Main content'}
              </div>
            </Container.Main>
            {controls.rightAside && (
              <Container.RightAside>
                <div className='docs-showcase-block'>
                  {locale === 'ru' ? 'Правая колонка' : 'Right sidebar'}
                </div>
              </Container.RightAside>
            )}
          </Container>
        </div>
      );
      break;
    case 'Text':
      preview = (
        <div className='docs-showcase-field'>
          <Text
            size={size as 's' | 'm' | 'l'}
            medium={Boolean(controls.medium)}
            as={controls.as as 'span' | 'p' | 'div'}
          >
            {String(controls.children)}
          </Text>
        </div>
      );
      break;
    case 'Icon':
      preview = (
        <Icon
          tag={icons[controls.tag as keyof typeof icons]}
          size={size as 's' | 'm' | 'l'}
        />
      );
      break;
    case 'Content':
      preview = (
        <Content
          size={size as 's' | 'm' | 'l'}
          medium={Boolean(controls.medium)}
          as={controls.as as 'div' | 'span'}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        >
          {String(controls.children)}
        </Content>
      );
      break;
    default:
      preview = <p>{sample}</p>;
  }

  return (
    <div className='docs-showcase-wrap'>
      <div
        className='docs-component-preview docs-showcase not-prose'
        data-component={name}
      >
        <div className='docs-showcase-stage'>{preview}</div>
      </div>
      {reference?.props.some((prop) => prop.control) && (
        <div className='docs-showcase-controls not-prose'>
          <p>{locale === 'ru' ? 'Настройки примера' : 'Example controls'}</p>
          <div className='docs-showcase-controls-grid'>
            {reference.props
              .filter((prop) => prop.control)
              .map((prop) => (
                <label
                  key={prop.name}
                  title={prop[locale]}
                  className={
                    prop.control === 'boolean' ? 'docs-showcase-control-boolean' : undefined
                  }
                >
                  <span>
                    {controlLabels[prop.name]?.[locale] ?? prop.name}
                    <code>{prop.name}</code>
                  </span>
                  {prop.control === 'select' && (
                    <span className='docs-showcase-select'>
                      <select
                        value={String(controls[prop.name])}
                        onChange={(event) =>
                          setControlValues({ ...controlValues, [prop.name]: event.target.value })
                        }
                      >
                        {prop.options?.map((option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </span>
                  )}
                  {prop.control === 'text' && (
                    <input
                      type='text'
                      value={String(controls[prop.name] ?? '')}
                      onChange={(event) =>
                        setControlValues({ ...controlValues, [prop.name]: event.target.value })
                      }
                    />
                  )}
                  {prop.control === 'number' && (
                    <input
                      type='number'
                      min='0'
                      value={Number(controls[prop.name])}
                      onChange={(event) =>
                        setControlValues({
                          ...controlValues,
                          [prop.name]: Number(event.target.value),
                        })
                      }
                    />
                  )}
                  {prop.control === 'boolean' && (
                    <input
                      type='checkbox'
                      checked={Boolean(controls[prop.name])}
                      onChange={(event) =>
                        setControlValues({ ...controlValues, [prop.name]: event.target.checked })
                      }
                    />
                  )}
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationsDemoButton({ locale }: { locale: 'ru' | 'en' }) {
  const { showNotification } = useNotifications();

  return (
    <Button
      onClick={() =>
        showNotification({
          headline: locale === 'ru' ? 'Сохранено' : 'Saved',
          children: locale === 'ru' ? 'Изменения сохранены.' : 'Changes saved.',
        })
      }
    >
      {locale === 'ru' ? 'Показать уведомление' : 'Show notification'}
    </Button>
  );
}

function ProviderDialogButton({ locale }: { locale: 'ru' | 'en' }) {
  const { closeDialog } = useDialog();
  const openDialog = useShowDialog(() => (
    <Dialog id='docs-provider-dialog'>
      <Dialog.Content>
        <Dialog.Header>{locale === 'ru' ? 'Диалог провайдера' : 'Provider dialog'}</Dialog.Header>
        <Dialog.Body>{locale === 'ru' ? 'Содержимое диалога' : 'Dialog content'}</Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => closeDialog('docs-provider-dialog')}>
            {locale === 'ru' ? 'Закрыть' : 'Close'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ));

  return <Button onClick={openDialog}>{locale === 'ru' ? 'Открыть диалог' : 'Open dialog'}</Button>;
}
