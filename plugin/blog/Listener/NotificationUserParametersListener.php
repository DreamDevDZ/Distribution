<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 * 
 * Date: 4/13/15
 */

namespace Icap\BlogBundle\Listener;

use Claroline\CoreBundle\Event\Notification\NotificationUserParametersEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class NotificationUserParametersListener.
 *
 * @DI\Service()
 */
class NotificationUserParametersListener
{
    /**
     * @param NotificationUserParametersEvent $event
     *
     * @DI\Observe("icap_notification_user_parameters_event")
     */
    public function onGetTypesForParameters(NotificationUserParametersEvent $event)
    {   
        $children = array(
            'new_blog',
            'add_new_comment',
            'add_new_post',
            'deletion_blog',
            'delete_comment',
            'delete_post'
        );
        $event->addTypes('icap_blog', false, 'icap_blog',$children);
        $event->addTypes($children, true, 'icap_blog');
        
    }
}
