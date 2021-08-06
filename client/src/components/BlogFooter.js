import React from 'react'
import {Link} from 'react-router-dom';

import {Menu, Icon} from 'semantic-ui-react'

const BlogFooter = () => {
    return (
                
        <Menu 
            style={{ marginTop: '50px' }} 
            icon='labeled'
            attached='bottom' 
            inverted 
            size="massive" 
            color="black"
            borderless
            widths={4}
            > 
        <Menu.Item header icon='world'>Neuroscience Blog</Menu.Item>
        <Menu.Item
        header
          name='My Portfolio'
          /* active={activeItem === 'video camera'}
          onClick={this.handleItemClick} */
          href='#'
        >
          <Icon name='world' />
          My Portfolio
        </Menu.Item>
          <Menu.Item
          header
          name='My GitHub'
          /* active={activeItem === 'video camera'}
          onClick={this.handleItemClick} */
          href='https://github.com/sejogit28'
        >
          <Icon name='github' />
          My GitHub
        </Menu.Item>

        <Menu.Item
            header
            name='My Linkedin'
          /* active={activeItem === 'video camera'}
            onClick={this.handleItemClick} */
            href='https://www.linkedin.com/in/sean-joseph-41ab49114/'
        >
          <Icon name='linkedin' />
          My Linkedin
        </Menu.Item>
        </Menu>

    )
}

export default BlogFooter
