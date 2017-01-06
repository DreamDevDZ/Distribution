import React, {PropTypes as T} from 'react'
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import classes from 'classnames'
import {t, tex} from './../../utils/translate'
import {generateUrl} from './../../utils/routing'
import {VIEW_EDITOR, VIEW_PLAYER} from './../enums'

// can't make react-bootstrap's NavItem to work...
const NavLink = props =>
  <li role="presentation">
    <a href={props.href}>
      {props.children}
    </a>
  </li>

NavLink.propTypes = {
  href: T.string.isRequired,
  children: T.node.isRequired
}

const NavLinkButton = props =>
  <li role="presentation">
    <button
      className="btn btn-link navbar-btn"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  </li>

NavLinkButton.propTypes = {
  disabled: T.bool.isRequired,
  onClick: T.func.isRequired
}

export const TopBar = props =>
  <Navbar collapseOnSelect fluid>
    <Navbar.Header>
      <Navbar.Toggle/>
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavLink href="#overview">
          <span className="fa fa-fw fa-info"></span>
          {tex('overview')}
        </NavLink>
        <NavLink href="#editor">
          <span className="fa fa-fw fa-pencil"></span>
          {t('edit')}
        </NavLink>
        {!props.published &&
          <NavItem eventKey={4} href="#">
            <span className="fa fa-fw fa-share-square-o"></span>
            {t('publish')}
          </NavItem>
        }
        {props.published &&
          <NavItem eventKey={4} href="#">
            <span className="fa fa-fw fa-times"></span>
            {t('unpublish')}
          </NavItem>
        }
      </Nav>
      <Nav pullRight>
        {!props.empty && VIEW_PLAYER !== props.viewMode &&
          <NavLink href="#test">
            <span className="fa fa-fw fa-play"></span>
            {tex('exercise_try')}
          </NavLink>
        }
        {props.hasPapers &&
          <NavDropdown
            id="results-menu"
            eventKey={6}
            title={
              <span>
                <span className="fa fa-fw fa-check-square-o"></span>
                {tex('result')}
              </span>
            }
          >
            <MenuItem href="#papers">
              <span className="fa fa-fw fa-list"></span>
              {tex('results_list')}
            </MenuItem>
            <MenuItem eventKey={6.2} href={generateUrl('ujm_exercise_docimology', {id: props.id})}>
              <span className="fa fa-fw fa-bar-chart"></span>
              {tex('docimology')}
            </MenuItem>
            <MenuItem eventKey={6.3}>
              <span className="fa fa-fw fa-table"></span>
              {tex('export_csv_results')}
            </MenuItem>
          </NavDropdown>
        }
        {VIEW_EDITOR === props.viewMode &&
          <NavLinkButton
            disabled={props.saved}
            onClick={() => !props.saved && props.saveQuiz()}
          >
            <span className="fa fa-fw fa-save"></span>
            {t('save')}
          </NavLinkButton>
        }
      </Nav>
    </Navbar.Collapse>
  </Navbar>

TopBar.propTypes = {
  id: T.string.isRequired,
  empty: T.bool.isRequired,
  published: T.bool.isRequired,
  hasPapers: T.bool.isRequired,
  viewMode: T.string.isRequired,
  saveQuiz: T.func.isRequired,
  saved: T.bool.isRequired
}
