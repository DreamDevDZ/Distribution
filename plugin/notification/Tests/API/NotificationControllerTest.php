<?php

namespace Icap\NotificationBundle\Tests\API;

use Claroline\CoreBundle\Library\Testing\Persister;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;

class NotificationControllerTest extends TransactionalTestCase
{
    protected function setUp()
    {
        parent::setUp();
        $this->persister = $this->client->getContainer()->get('claroline.library.testing.persister');
    }

    /**
     * I don't know how to create notifications properly, so I'm only testing if it returns a 200 status code.
     */
    public function testGetNotificationsAction()
    {
        $user = $this->createUser('user');
        $this->logIn($user);
        $this->client->request('GET', '/icap_notification/api/notifications');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    /**
     * I don't know how to create notifications properly, so I'm only testing if it returns a 200 status code.
     */
    public function testGetNotificationsReadAction()
    {
        $user = $this->createUser('user');
        $this->logIn($user);
        $this->client->request('GET', '/icap_notification/api/notifications/read');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testGetUserParametersAction()
    {
        $user = $this->createUser('user');
        $this->logIn($user);
        $this->client->request('GET', '/icap_notification/api/notifications/parameters/user');
        //test more later
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testPostUserParametersAction()
    {
    }

    private function createUser($name)
    {
        $user = $this->persister->user($name);
        $this->persister->persist($user);

        return $user;
    }
}
