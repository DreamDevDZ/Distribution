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

namespace Icap\DropzoneBundle\Listener;

use Claroline\CoreBundle\Event\Notification\NotificationParametersEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class NotificationParametersListener.
 *
 * @DI\Service()
 */
class NotificationParametersListener
{
    /**
     * @param NotificationParametersEvent $event
     *
     * @DI\Observe("icap_notification_parameters_event")
     */
    public function onGetTypesForParameters(NotificationParametersEvent $event)
    {
        $children = [
            'correction_received_by_trainer',
            'correction_available_for_learners',
        ];
        $event->addTypes('icap_dropzone', false, 'icap_dropzone', $children);
        $event->addTypes($children, true, 'icap_dropzone');
    }
}
