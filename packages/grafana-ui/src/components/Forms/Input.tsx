import React, { cloneElement, FC, HTMLProps, isValidElement, ReactNode } from 'react';
import { GrafanaTheme } from '@grafana/data';
import { css, cx } from 'emotion';
import { selectThemeVariant, stylesFactory, useTheme } from '../../themes';
import { getFocusStyle, sharedInputStyle } from './commonStyles';
import { Spinner } from '..';

interface Props extends HTMLProps<HTMLInputElement> {
  /** Show an invalid state around the input */
  invalid?: boolean;
  /** Show an icon as a prefix in the input */
  icon?: string;
  /** Show a loading indicator as a suffix in the input */
  loading?: boolean;
  /** Add a component as an addon before the input  */
  addonBefore?: ReactNode;
  /** Add a component as an addon after the input */
  addonAfter?: ReactNode;
}

const getInputStyle = stylesFactory(
  (theme: GrafanaTheme, invalid = false, prefix = false, suffix = false, addonBefore = false, addonAfter = false) => {
    const colors = theme.colors;
    const backgroundColor = selectThemeVariant({ light: colors.white, dark: colors.gray15 }, theme.type);
    const borderColor = selectThemeVariant({ light: colors.gray4, dark: colors.gray25 }, theme.type);
    const borderRadius = theme.border.radius.sm;
    const height = theme.spacing.formInputHeight;
    const inputBorders = cx(
      invalid &&
        css`
          border: ${theme.border.width.sm} solid ${colors.redBase};
        `,
      (prefix || addonBefore) &&
        css`
          border-left: 0;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        `,
      (suffix || addonAfter) &&
        css`
          border-right: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        `
    );

    const prefixSuffix = css`
      background-color: ${backgroundColor};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 0;
      flex-shrink: 0;
      width: 30px;
      z-index: 0;
    `;

    return {
      inputWrapper: cx(
        css`
          width: 100%;
          display: flex;
          height: ${height};
          border: 1px solid ${borderColor};
          border-radius: ${borderRadius};
        `,
        getFocusStyle(theme)
      ),
      prefix: cx(
        prefixSuffix,
        css`
          &:first-child {
            border-left: 1px solid ${borderColor};
            border-top-left-radius: ${borderRadius};
            border-bottom-left-radius: ${borderRadius};
          }
        `
      ),
      input: cx(
        css`
          height: 100%;
          width: 100%;
          flex-grow: 1;
          margin-bottom: ${invalid ? theme.spacing.formSpacingBase / 2 : theme.spacing.formSpacingBase * 2}px;
          position: relative;
          z-index: 1;
        `,
        sharedInputStyle(theme),
        inputBorders
      ),
      addon: css`
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${backgroundColor};
        flex-grow: 0;
        flex-shrink: 0;
        z-index: 0;
        position: relative;

        &:first-child {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: 1px solid ${borderColor};
        }

        &:last-child {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: 1px solid ${borderColor};
        }
      `,
      addonElement: css`
        label: addon-override;
        border: 0;
        width: 100%;
        height: 100%;

        &:focus {
          box-shadow: none;
        }
      `,
      suffix: cx(
        prefixSuffix,
        css`
          &:last-child {
            border-right: 1px solid ${borderColor};
            border-top-right-radius: ${borderRadius};
            border-bottom-right-radius: ${borderRadius};
          }
        `
      ),
    };
  }
);

export const Input: FC<Props> = props => {
  const { addonAfter, addonBefore, icon, invalid, loading, ...restProps } = props;

  const theme = useTheme();
  const styles = getInputStyle(theme, invalid, !!icon, !!loading, !!addonBefore, !!addonAfter);

  return (
    <div className={styles.inputWrapper} tabIndex={0}>
      {!!addonBefore && (
        <div className={styles.addon}>
          {isValidElement(addonBefore) &&
            cloneElement(addonBefore, {
              className: styles.addonElement,
            })}
        </div>
      )}
      {icon && (
        <div className={styles.prefix}>
          <i className={icon} />
        </div>
      )}
      <input className={styles.input} {...restProps} />
      {loading && (
        <div className={styles.suffix}>
          <Spinner />
        </div>
      )}
      {!!addonAfter && (
        <div className={styles.addon}>
          {isValidElement(addonAfter) &&
            cloneElement(addonAfter, {
              className: styles.addonElement,
            })}
        </div>
      )}
    </div>
  );
};
